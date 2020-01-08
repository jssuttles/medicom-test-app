const ENTER_KEY = 13;

/**
 * Controls UI for messages
 */
class MessengerUI {
  /**
   * Class Constructor
   * @param {WebsocketClient} wsClient
   */
  constructor(wsClient) {
    this.wsClient = wsClient;

    // add the send to 'All' option by default
    this._setupDropdownLabel(-1);

    // bind all functions that are called by reference
    this._onSocketId = this._onSocketId.bind(this);
    this._onMessage = this._onMessage.bind(this);
    this._onWhisper = this._onWhisper.bind(this);
    this._onSocketClosed = this._onSocketClosed.bind(this);
    this._onOtherSockets = this._onOtherSockets.bind(this);
    this._onNewSocket = this._onNewSocket.bind(this);
  }

  /**
   * Setup dropdown label
   * @param {Number} socketId
   * @private
   */
  _setupDropdownLabel(socketId) {
    const socketIdText = this._getTextFromSocketId(socketId);
    $('#sendToDropdownLabelId').text(socketIdText).data('socketId', socketId);
  }

  /**
   * Helper function for _addDropdownHTML
   * Returns what to display when given a socketId
   * @param {Number} socketId
   * @return {Number|String}
   * @private
   */
  _getTextFromSocketId(socketId) {
    return socketId >= 0 ? socketId : 'All';
  }

  /**
   * Creates an item to add to the socket dropdown
   * @param {Number} socketId
   * @private
   */
  _addDropdownHTML(socketId) {
    const $sendToDropdown = $('#sendToDropdown');
    const $dropdownItemHTML = window.helpers.getHTMLFromTemplate('sendToTemplate');

    const text = this._getTextFromSocketId(socketId);

    $dropdownItemHTML.find('.sendToId').text(text);

    $dropdownItemHTML.data('socketId', socketId);

    $sendToDropdown.append($dropdownItemHTML);
  }

  /**
   * Reset the socket selection dropdown
   * @private
   */
  _setupDropdown() {
    const otherIds = this.wsClient.getOtherSocketIds();

    const $sendToDropdown = $('#sendToDropdown');
    $sendToDropdown.empty();

    otherIds.forEach((otherId) => this._addDropdownHTML(otherId));

    this._addDropdownHTML(-1);

    $('.sendToOption').off('click').on('click', (e) => {
      this._setupDropdownLabel($(e.currentTarget).data('socketId'));
    });
  }

  /**
   * On 'socket' event, display current user's socketId
   * @param {Object} data     object transferred from WS server to receiver
   * @private
   */
  _onSocketId(data) {
    $('#messengerSocketId').text(data.socketId);
  }

  /**
   * On 'message' event, prepend message to messengerMessagesContainer
   * @param {Object} data     object transferred from sender to WS server to receiver
   * @private
   */
  _onMessage(data) {
    const $messageHTML = window.helpers.getHTMLFromTemplate('messageTemplate');

    $messageHTML.find('.socketId').text(data.from);
    $messageHTML.find('.message').text(data.message);

    $messageHTML.data('sentBy', data.from);

    $('#messengerMessagesContainer').prepend($messageHTML);
  }

  /**
   * TODO
   * @param {Object} data     object transferred from sender to WS server to receiver
   * @private
   */
  _onWhisper(data) {

  }

  /**
   * When initial peer sockets are discovered, reset dropdown
   * @private
   */
  _onOtherSockets() {
    this._setupDropdown();
  }

  /**
   * When a peer socket is closed,
   * Set all messages by that user to inactive
   * Reset dropdown
   * @param {Object} data
   * @private
   */
  _onSocketClosed(data) {
    const closedSocketId = data.socketId;

    $('.messageContainer').each((index, element) => {
      const $element = $(element);
      const socketId = $element.data('sentBy');
      if (socketId === closedSocketId) {
        $element.addClass('inactive');
      }
    });

    this._setupDropdown();
  }

  /**
   * When a new peer is added, reset the dropdown
   * @private
   */
  _onNewSocket() {
    this._setupDropdown();
  }

  /**
   * Initializes the MessengerUI
   * Sets up click events and Websocket message callbacks
   */
  init() {
    $('#sendMessageButton').on('click', () => {
      const $messageInput = $('#messageInput');
      const message = $messageInput.val();
      this.wsClient.sendMessage(message);
      $messageInput.val('');
    });

    $('#messageInput').on('keyup', (e) => {
      if (e.keyCode === ENTER_KEY) {
        $('#sendMessageButton').trigger('click');
      }
      return e;
    });

    this.wsClient.setEventCallback('socketId', this._onSocketId);
    this.wsClient.setEventCallback('message', this._onMessage);
    this.wsClient.setEventCallback('whisper', this._onWhisper);
    this.wsClient.setEventCallback('otherSocketClosed', this._onSocketClosed);
    this.wsClient.setEventCallback('otherSockets', this._onOtherSockets);
    this.wsClient.setEventCallback('newSocket', this._onNewSocket);
  }
}

// on jQuery ready, initialize WebsocketClient and MessengerUI
$(() => {
  const ws = new window.WebsocketClient();
  window.ws = ws;

  const messengerUI = new MessengerUI(ws);
  window.messengerUI = messengerUI;

  ws.connect()
  .then(() => {
    messengerUI.init();
  });
});
