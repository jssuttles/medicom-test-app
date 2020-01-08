const WSServer = require('ws').Server;
const logger = require('../modules/logger');

/**
 * Websocket Server
 * @property {Number} count     used to assign socketId to new socket connections
 */
class WebsocketServer extends WSServer {
  /**
   * Class Constructor
   * @param server
   */
  constructor(server) {
    super({
      server,
      clientTracking: true,
    }, null);

    this.count = 0;
    this.on('connection', this._onConnection.bind(this));
  }

  /**
   * Given a socketId, return all the other connected socketIds
   * @param {Number} socketId       socketId to exclude
   * @return {Number[]}
   * @private
   */
  _getOtherIds(socketId) {
    const otherIds = [];
    this.clients.forEach((client) => {
      if (client.socketId !== socketId) {
        otherIds.push(client.socketId);
      }
    });

    return otherIds;
  }

  /**
   * Route a message to an appropriate callback
   * @param {WebSocket} socket     socket message is from
   * @param {String} message       message received
   * @private
   */
  _route(socket, message) {
    try {
      // websocket messages are strings, but we should be passing stringified objects
      const jsonMessage = JSON.parse(message);

      // default to always attaching who the message is from
      jsonMessage.data.from = socket.socketId;

      switch (jsonMessage.eventName) {
        case 'whisper':
          this._onWhisperEvent(jsonMessage);
          break;
        case 'message':
          this._onMessageEvent(jsonMessage);
          break;
        default:
          logger.info(jsonMessage);
      }
    } catch (e) {
      logger.error(e);
    }
  }

  /**
   * On `whisper` event, send message to specified client socket
   * @param {Object} json             message object to send
   * @private
   */
  _onWhisperEvent(json) {
    if (!json.data.to) {
      throw new Error('Client socketId to whisper to not included');
    }
    const clientSocketToWhisperTo = Array.from(this.clients)
    .find((clientSocket) => clientSocket.socketId === json.data.to);

    if (!clientSocketToWhisperTo) {
      throw new Error(`Client socket to whisper to (${json.data.to}) not found`);
    }
    clientSocketToWhisperTo.sendJSON(json);
  }

  /**
   * On `message` event, send message to all client sockets
   * @param {Object} json             message object to send
   * @private
   */
  _onMessageEvent(json) {
    this.clients.forEach((clientSocket) => {
      clientSocket.sendJSON(json);
    });
  }

  /**
   * Broadcast message to all clients excluding a few
   * @param {Object} json             message object to send
   * @param {Number[]} excludingIds   socketIds to exclude
   * @private
   */
  _broadcastJSON(json, excludingIds = []) {
    this.clients.forEach((clientSocket) => {
      if (!excludingIds.includes(clientSocket.socketId)) {
        clientSocket.sendJSON(json);
      }
    });
  }

  /**
   * On new socket connection, setup the socket with listeners and basic information
   * @param {WebSocket} client    client that is connecting
   * @private
   */
  _onConnection(client) {
    // eslint-disable-next-line no-param-reassign
    client.socketId = this.count;
    this.count += 1;
    console.log(`client ${client.socketId} connected`);

    // eslint-disable-next-line no-param-reassign
    client.sendJSON = (json) => {
      const stringifiedJSON = JSON.stringify(json);
      console.log(`sending to ${client.socketId}: ${stringifiedJSON}`);
      client.send(stringifiedJSON, {}, null);
    };

    // handle message and close event
    client.on('message', (message) => {
      console.log(`received from ${client.socketId}: ${message}`);

      this._route(client, message);
    });

    client.on('close', () => {
      console.log(`socket ${client.socketId} has closed`);
      this._broadcastJSON({
        eventName: 'otherSocketClosed',
        data: {
          socketId: client.socketId,
        },
      });
    });

    // send client its socketId
    client.sendJSON({
      eventName: 'socketId',
      data: {
        socketId: client.socketId,
      },
    });

    // send client its peer socketIds
    client.sendJSON({
      eventName: 'otherSockets',
      data: {
        socketIds: this._getOtherIds(client.socketId),
      },
    });

    // send other clients the new client's socketId
    this._broadcastJSON({
      eventName: 'newSocket',
      data: {
        socketId: client.socketId,
      },
    }, [
      client.socketId,
    ]);
  }
}

module.exports = (server) => new WebsocketServer(server);
