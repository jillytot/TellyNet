import assert from 'assert';
import sinon from 'sinon';

const http = require('http');
const httpPort = 8888;
let server;
const EventEmitter = require('events').EventEmitter;

const ConnectionManager = require('../../../src/connections/ConnectionManager');

describe('ConnectionManager', function () {
  beforeEach(function () {
    server = http.createServer().listen(httpPort);
  });

  afterEach(done =>
    server.close(function () {
      done();
    })
  );

  it('create a new ConnectionManager instance', function () {
    const setupListenersStub = sinon.stub(ConnectionManager.prototype, 'setupListeners').returns(0);
    const connectionManager = new ConnectionManager(server);

    assert(Array.isArray(connectionManager.socketConnections), 'socketConnections is an array');
    assert(setupListenersStub.calledOnce);
  });

  it('sets up a request listener on the server', function() {
    //@TODO
  });
});
