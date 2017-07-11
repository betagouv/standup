import PhoenixSocket from 'phoenix/services/phoenix-socket';

export default PhoenixSocket.extend({
  websocketServerUrl: `ws://${document.location.hostname}:4000`,
  channel: null,

  // Initializes webscocket client.
  // Adds event listeners on 'open', 'error' and 'close'.
  init() {
    this.on('open', this.open);
    this.on('error', this.error);
    this.on('close', this.close);
  },

  // Connects to the websocket server.
  connect() {
    this._super(this.get('websocketServerUrl'));
    return this;
  },

  // Joins the 'standup' channel, if connection state is 'open'.
  join() {
    let socket  = this.get('socket');
    let channel = this.get('channel');

    if(!socket || socket.connectionState() !== 'open') {
      return this;
    }

    channel.join()
      .receive('ok', this.ok)
      .receive('error', this.error)
      .receive('timeout', this.timeout);

    return this;
  },

  // private

  // Sets channel to 'standup' and calls `this.join()`.
  open() {
    console.info('Socket connection open!'); // eslint-disable-line no-console
    let socket  = this.get('socket');
    let channel = socket.channel('standup');

    this.set('channel', channel);
    this.join();

    return this;
  },

  // Logs an error.
  error() {
    console.error('There was an error with the connection!'); // eslint-disable-line no-console
    return this;
  },

  // Logs a connection drop.
  close() {
    console.warn('Socket connection dropped!'); // eslint-disable-line no-console
    return this;
  },

  // Logs a successful channel join.
  ok() {
    console.info('Channel joined, hello there!'); // eslint-disable-line no-console
    return this;
  },

  // Logs a channel join/push timeout.
  timeout() {
    console.warn('Can\'t join channel, networking issues?'); // eslint-disable-line no-console
    return this;
  }
});
