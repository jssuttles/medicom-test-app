const WSServer = require('ws').Server;
const logger = require('../modules/logger');


class WebsocketServer extends WSServer {
  constructor(server) {
    super({
      server,
      clientTracking: true,
    });

    this.count = 0;
    this.on('connection', this._onConnection.bind(this));
  }

  getOtherIds(id) {
    const otherIds = [];
    this.clients.forEach((client) => {
      if (client.id !== id) {
        otherIds.push(client.id);
      }
    });

    return otherIds;
  }

  _routeMessage(socket, message) {
    try {
      const jsonMessage = JSON.parse(message);

      jsonMessage.from = socket.id;

      switch (jsonMessage.eventName) {
        case 'whisper':
          return this._onWhisperEvent(jsonMessage);
        case 'message':
          return this._onMessageEvent(jsonMessage);
        default:
          logger.info(jsonMessage);
      }
    } catch (e) {
      logger.error(e);
    }
    return false;
  }

  _onWhisperEvent(jsonMessage) {
    const stringifiedMessage = JSON.stringify(jsonMessage);
    this.clients.forEach((clientSocket) => {
      if (jsonMessage.to === clientSocket.id) {
        clientSocket.send(stringifiedMessage);
      }
    });
  }

  _onMessageEvent(jsonMessage) {
    const stringifiedMessage = JSON.stringify(jsonMessage);
    this.clients.forEach((clientSocket) => {
      clientSocket.send(stringifiedMessage);
    });
  }

  broadcastJSON(json, excludingIds = []) {
    this.clients.forEach((clientSocket) => {
      if (!excludingIds.includes(clientSocket.id)) {
        clientSocket.sendJSON(json);
      }
    });
  }

  _onConnection(socket) {
    // eslint-disable-next-line no-param-reassign
    socket.id = this.count;
    this.count += 1;
    console.log('Connection');

    // eslint-disable-next-line no-param-reassign
    socket.sendJSON = (json) => {
      socket.send(JSON.stringify(json));
    };

    // eslint-disable-next-line no-param-reassign
    socket.broadcastJSON = (json, excludeMe) => {
      this.clients.forEach((clientSocket) => {
        if (!excludeMe || socket.id !== clientSocket.id) {
          clientSocket.sendJSON(json);
        }
      });
    };
    socket.on('message', (message) => {
      console.log(`received: ${message}`);

      this._routeMessage(socket, message);
    });

    socket.on('close', () => {
      this.broadcastJSON({
        eventName: 'otherSocketClosed',
        data: socket.id,
      });
    });

    socket.sendJSON({
      eventName: 'socketId',
      data: socket.id,
    });

    socket.sendJSON({
      eventName: 'otherSockets',
      data: this.getOtherIds(socket.id),
    });

    this.broadcastJSON({
      eventName: 'newSocket',
      data: socket.id,
    }, [
      socket.id,
    ]);
  }
}

module.exports = server => new WebsocketServer(server);
