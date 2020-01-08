/**
 * @typedef {Object} Message
 * @property {String} eventName
 * @property {Object} data
 */

/**
 * @typedef {Function} EventCallback
 * @param {Object} data     the Message.data
 */

/**
 * Handles websocket communication for the messenger
 * @property {Number} socketId      this client's Websocket Server assigned socketId
 * @property {WebSocket} wsClient   reference to connection to Websocket Server
 * @property {Object<String, EventCallback>} eventCallbacks    maps eventName to callbacks
 * @property {Set<Number>} otherSocketIds holds socketIds
 */
class WebsocketClient {
  /**
   * Class constructor
   */
  constructor() {
    this.socketId = null;
    this.wsClient = null;
    this.eventCallbacks = {};
    this.otherSocketIds = new Set();
    // when functions are passed by reference, they do not maintain `this`
    this._onMessage = this._onMessage.bind(this);
  }

  /**
   * Get other known peer socketIds
   * @return {Number[]}
   */
  getOtherSocketIds() {
    // keys are always returned as strings
    // socketIds are numbers, we need to map to parsed socketIds
    return Array.from(this.otherSocketIds);
  }

  /**
   * On Websocket message event, perform an action
   * @param {MessageEvent} messageEvent   message event from WebSocket connection
   * @private
   */
  _onMessage(messageEvent) {
    try {
      // .data shall be in Message object format
      const json = JSON.parse(messageEvent.data);
      console.log(`eventName: ${json.eventName}, data: ${JSON.stringify(json.data)}`);

      switch (json.eventName) {
        case 'socketId':
          // after initial connection, Websocket Server will return a socketId for this client
          this.socketId = json.data.socketId;
          break;
        case 'otherSockets':
          // initial discovery with all current peers
          json.data.socketIds.forEach((otherId) => {
            this.otherSocketIds.add(otherId);
          });
          break;
        case 'newSocket':
          // new peer discovered
          this.otherSocketIds.add(json.data.socketId);
          break;
        case 'otherSocketClosed':
          // peer has disconnected
          this.otherSocketIds.delete(json.data.socketId);
          break;
        default:
      }
      if (this.eventCallbacks[json.eventName]) {
        this.eventCallbacks[json.eventName](json.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Set callback for an event
   * @param {String} eventName          eventName to map from
   * @param {Function} messageCallback  callback to call when event occurs
   */
  setEventCallback(eventName, messageCallback) {
    this.eventCallbacks[eventName] = messageCallback;
  }

  /**
   * Send a message to one client specified by socketId
   * @param {Number} socketId     other client's socketId
   * @param {String} message      message to send to the other client
   * @throws Error if websocket connection has not been established
   * @throws Error if peer is not known to be connected
   */
  sendWhisper(socketId, message) {
    if (!this.otherSocketIds.has(socketId)) {
      throw new Error('Peer is not connected');
    }
    this._send({
      eventName: 'whisper',
      data: {
        message,
        to: socketId,
      },
    });
  }

  /**
   * Send a message to all clients
   * @param {String} message
   * @throws Error if websocket connection has not been established
   */
  sendMessage(message) {
    this._send({
      eventName: 'message',
      data: {
        message,
      },
    });
  }

  /**
   * Send object to WebSocket Server
   * @param {Object} object
   * @private
   * @throws Error if websocket connection has not been established
   */
  _send(object) {
    if (!this.wsClient) {
      throw new Error('Websocket connection not established');
    }
    this.wsClient.send(JSON.stringify(object));
  }

  /**
   * Get the websocket server string from the api server
   * Connect to the websocket server
   * @return {Promise}
   */
  connect() {
    return window.helpers.get('/websocket')
    .then((websocketServer) => {
      this.wsClient = new WebSocket(websocketServer);

      // When the websocket server is connected to, setup the onmessage listener
      this.wsClient.onopen = () => {
        this.wsClient.onmessage = this._onMessage;
      };
    })
    .catch((err) => {
      console.error(err);
    });
  }
}

window.WebsocketClient = WebsocketClient;
