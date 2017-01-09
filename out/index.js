'use strict';

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _stories = require('./routes/stories');

var stories = _interopRequireWildcard(_stories);

var _constants = require('./constants');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let app = (0, _express2.default)();

// FIXME: This is impossible to test. It's also likely really inefficient to
// open a new connection to the database for every request.

app.get('/stories', (request, response) => {
  (0, _co2.default)(function* () {
    try {
      const connection = yield (0, _constants.getDatabase)().connect();

      response.json((yield stories.getAll(connection)));
    } catch (e) {
      console.error(e.stack);
      response.status(400).end();
    } finally {
      connection.close();
    }
  });
});

app.get('/stories/:type', (request, response) => {
  (0, _co2.default)(function* () {
    try {
      const connection = yield (0, _constants.getDatabase)().connect();

      switch (request.params.type) {
        case 'news':
          response.json((yield stories.getNews(connection)));
        case 'launches':
          response.json((yield stories.getLaunches(connection)));
        default:
          response.status(404).end();
      }
    } catch (e) {
      console.error(e.stack);
      response.status(400).end();
    } finally {
      connection.close();
    }
  });
});

app.listen(_constants.SERVER_PORT);

console.log('\n\t Space Watch Backend started...');