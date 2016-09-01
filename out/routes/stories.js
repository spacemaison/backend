'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNews = getNews;
exports.getLaunches = getLaunches;
exports.getAll = getAll;

var _spaceWatchShared = require('space-watch-shared');

const { NewsStory, LaunchStory } = _spaceWatchShared.models;

function* getNews(connection) {
  const news = yield connection.query(`
    select * from news_stories order by created_at DESC limit 25
  `);

  return news.map(news => new NewsStory(news));
}

function* getLaunches(connection) {
  const launches = yield connection.query(`
    select * from launch_stories order by time DESC limit 25
  `);

  return launches.map(launch => new LaunchStory(launch));
}

function* getAll(connection) {
  return {
    news: yield* getNews(connection),
    launches: yield* getLaunches(connection)
  };
}