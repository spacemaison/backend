'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SERVER_PORT = exports.DB_SERVER_URL = undefined;
exports.getDatabase = getDatabase;

var _pgPromise = require('pg-promise');

var _pgPromise2 = _interopRequireDefault(_pgPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DB_SERVER_URL = exports.DB_SERVER_URL = 'postgres://localhost/space_watch';
const SERVER_PORT = exports.SERVER_PORT = 3000;

let db;
function getDatabase() {
  if (!db) {
    db = (0, _pgPromise2.default)()(DB_SERVER_URL);
  }

  return db;
}