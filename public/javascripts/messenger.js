const ENTER_KEY = 13;

class WebsocketClient {
  constructor() {
    this.socketId = null;
    this.wsClient = null;
    this._onMessage = this._onMessage.bind(this);
    this.messageCallbacks = {};
    this.otherClients = {};
  }

  getOtherClients() {
    return Object.keys(this.otherClients);
  }

  _onMessage(message) {
    try {
      const json = JSON.parse(message.data);

      switch (json.eventName) {
        case 'socketId':
          this.socketId = json.data;
          break;
        case 'otherSockets':
          json.data.forEach((otherId) => {
            this.otherClients[otherId] = true;
          });
          break;
        case 'newSocket':
          this.otherClients[json.data] = true;
          break;
        case 'otherSocketClosed':
          delete this.otherClients[json.data];
          break;
        default:
      }
      console.log(json);
      if (this.messageCallbacks[json.eventName]) {
        this.messageCallbacks[json.eventName](json);
      }
    } catch (e) {
      console.error(e);
    }
  }

  setMessageCallback(eventName, messageCallback) {
    this.messageCallbacks[eventName] = messageCallback;
  }

  sendWhisper(id, message) {
    const jsonString = JSON.stringify({
      eventName: 'whisper',
      data: message,
      to: id,
    });
    return this.wsClient && this.wsClient.send(jsonString);
  }

  sendMessage(message) {
    const jsonString = JSON.stringify({
      eventName: 'message',
      data: message,
    });
    return this.wsClient && this.wsClient.send(jsonString);
  }

  connect() {
    window.helpers.get('/websocket')
    .then((websocketServer) => {
      this.wsClient = new WebSocket(websocketServer);

      this.wsClient.onopen = () => {
        this.wsClient.onmessage = this._onMessage;
      };
    })
    .catch((err) => {
      console.error(err);
    });
  }
}

class MessengerUI {
  constructor(wsClient) {
    this.wsClient = wsClient;

    this._onSocketId = this._onSocketId.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._onWhisper = this._onWhisper.bind(this);
    this._onSocketClosed = this._onSocketClosed.bind(this);
    this._onOtherSockets = this._onOtherSockets.bind(this);
    this._onNewSocket = this._onNewSocket.bind(this);

    this._setupDropdownLabel(-1);
  }

  _setupDropdownLabel(socketId) {
    const socketIdText = this._getTextFromSocketId(socketId);
    $('#sendToDropdownLabelId').text(socketIdText).data('socketId', socketId);
  }

  _getTextFromSocketId(id) {
    return id >= 0 ? id : 'All';
  }

  _addDropdownHTML(id) {
    const sendToDropdown = $('#sendToDropdown');
    const dropdownItemHTML = window.helpers.getHTMLFromTemplate('sendToTemplate');

    const text = this._getTextFromSocketId(id);

    dropdownItemHTML.find('.sendToId').text(text);

    dropdownItemHTML.data('socketId', id);

    sendToDropdown.append(dropdownItemHTML);
  }

  _setupDropdown() {
    const otherIds = this.wsClient.getOtherClients();

    const sendToDropdown = $('#sendToDropdown');
    sendToDropdown.empty();

    otherIds.forEach(otherId => this._addDropdownHTML(otherId));

    this._addDropdownHTML(-1);

    $('.sendToOption').off('click').on('click', (e) => {
      this._setupDropdownLabel($(e.currentTarget).data('socketId'));
    });
  }

  _onSocketId(messageJSON) {
    $('#messengerSocketId').text(messageJSON.data);
  }

  _onMessage(messageJSON) {
    const messageHTML = window.helpers.getHTMLFromTemplate('messageTemplate');

    messageHTML.find('.socketId').text(messageJSON.from);

    messageHTML.find('.message').text(messageJSON.data);

    messageHTML.data('sentBy', messageJSON.from);

    $('#messengerMessagesContainer').prepend(messageHTML);
  }

  _onWhisper(messageJSON) {

  }

  _onOtherSockets() {
    this._setupDropdown();
  }

  _onSocketClosed(messageJSON) {
    const closedSocketId = messageJSON.data;

    $('.messageContainer').each((index, element) => {
      const $element = $(element);
      const socketId = $element.data('sentBy');
      if (socketId === closedSocketId) {
        $element.addClass('inactive');
      }
    });

    this._setupDropdown();
  }

  _onNewSocket() {
    this._setupDropdown();
  }

  init() {
    $('#sendMessageButton').on('click', () => {
      const messageInput = $('#messageInput');
      const message = messageInput.val();
      this.wsClient.sendMessage(message);
      messageInput.val('');
    });

    $('#messageInput').on('keyup', (e) => {
      if (e.keyCode === ENTER_KEY) {
        $('#sendMessageButton').trigger('click');
      }
      return e;
    });

    this.wsClient.setMessageCallback('socketId', this._onSocketId);

    this.wsClient.setMessageCallback('message', this._onMessage);

    this.wsClient.setMessageCallback('whisper', this._onWhisper);

    this.wsClient.setMessageCallback('otherSocketClosed', this._onSocketClosed);

    this.wsClient.setMessageCallback('otherSockets', this._onOtherSockets);

    this.wsClient.setMessageCallback('newSocket', this._onNewSocket);
  }
}
$(() => {
  const ws = new WebsocketClient();
  window.ws = ws;

  const messengerUI = new MessengerUI(ws);
  window.messengerUI = messengerUI;

  messengerUI.init();
  ws.connect();
});
