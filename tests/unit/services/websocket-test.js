import { moduleFor, test } from 'ember-qunit';
import { Server } from 'mock-socket';

moduleFor('service:websocket', 'Unit | Service | websocket', {
  unit: true
});

test("it exposes websocket server's url", function(assert) {
  let websocket = this.subject();
  assert.ok(websocket.get('websocketServerUrl'));
});

test('it connects to websocket server', function(assert) {
  let done = assert.async();
  let websocket = this.subject();
  let websocketServerUrl = `${websocket.get(
    'websocketServerUrl'
  )}/websocket?vsn=1.0.0`;
  let mockServer = new Server(websocketServerUrl);

  websocket.on('open', () => {
    assert.ok('Socket was opened.');
    mockServer.stop();
    done();
  });

  websocket.connect();
});
