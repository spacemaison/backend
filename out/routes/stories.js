'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAll = getAll;
exports.getNews = getNews;
exports.getLaunches = getLaunches;
exports.getLaunchRocket = getLaunchRocket;
exports.getLaunchRocketFamily = getLaunchRocketFamily;
exports.getLaunchPads = getLaunchPads;
exports.getLaunchPad = getLaunchPad;
exports.getLaunchMissions = getLaunchMissions;
exports.getLaunchMission = getLaunchMission;
exports.getLaunchLocation = getLaunchLocation;
exports.getLaunchAgencies = getLaunchAgencies;
exports.getLaunchAgency = getLaunchAgency;

var _spaceWatchShared = require('space-watch-shared');

const { NewsStory, Launches } = _spaceWatchShared.models;
const {
  LaunchAgency,
  LaunchStory,
  LaunchLocation,
  LaunchPad,
  LaunchMission,
  LaunchRocket,
  LaunchRocketFamily } = Launches;

function* getAll(connection) {
  return {
    news: yield* getNews(connection),
    launches: yield* getLaunches(connection)
  };
}

function* getNews(connection) {
  const news = yield connection.query(`
    select * from news_stories order by created_at DESC limit 25
  `);

  return news.map(news => new NewsStory(news));
}

function* getLaunches(connection) {
  let launches = yield connection.query(`
    select
      id,
      "infoURLs",
      location,
      pads,
      missions,
      rocket,
      status,
      "videoURLs",
      "windowStart",
      "windowEnd"
    from launches
    order by "windowStart" DESC limit 25
  `);

  return yield mapAsync(launches, function* (launch) {
    return new LaunchStory({
      __proto__: launch,

      location: yield getLaunchLocation(connection, launch.location),
      pads: yield getLaunchPads(connection, launch.pads || []),
      missions: yield getLaunchMissions(connection, launch.missions || []),
      rocket: yield getLaunchRocket(connection, launch.rocket)
    });
  });
}

function* getLaunchRocket(connection, rocketId) {
  const rocket = yield connection.one(`
    select
      configuration,
      family,
      name,
      "wikiURL",
      "infoURLs",
      "imageURL",
      "imageSizes"
    from launch_rockets
    where id = ${ rocketId }
  `);

  return new LaunchRocket({
    __proto__: rocket,
    family: yield getLaunchRocketFamily(connection, rocket.family)
  });
}

function* getLaunchRocketFamily(connection, familyId) {
  const family = yield connection.one(`
    select agencies, name from launch_rocket_families where id = ${ familyId }
  `);

  return new LaunchRocketFamily({
    __proto__: family,
    agencies: yield getLaunchAgencies(connection, family.agencies || [])
  });
}

function* getLaunchPads(connection, padIds) {
  return yield mapAsync(padIds, getLaunchPad.bind(null, connection));
}

function* getLaunchPad(connection, padId) {
  return new LaunchPad((yield connection.one(`
    select
      "latitude",
      "longitude",
      "padType",
      "name",
      "mapURL",
      "retired",
      "wikiURL"
    from launch_pads
    where id = ${ padId }
  `)));
}

function* getLaunchMissions(connection, missionIds) {
  return yield mapAsync(missionIds, getLaunchMission.bind(null, connection));
}

function* getLaunchMission(connection, missionId) {
  return new LaunchMission((yield connection.one(`
    select agencies, description, "infoURLs", "wikiURL", name, type
    from launch_missions
    where id = ${ missionId }
  `)));
}

function* getLaunchLocation(connection, locationId) {
  return new LaunchLocation((yield connection.one(`
    select name, "countryCode", "infoURLs", "wikiURL"
    from launch_locations
    where id = ${ locationId }
  `)));
}

function* getLaunchAgencies(connection, agencies) {
  return yield mapAsync(agencies, getLaunchAgency.bind(null, connection));
}

function* getLaunchAgency(connection, agencyId) {
  return new LaunchAgency((yield connection.one(`
    select abbrev, "countryCode", "infoURLs", name, type, "wikiURL"
    from launch_agencies
    where id = ${ agencyId }
  `)));
}

function* mapAsync(items, mapper) {
  let returned = [];

  for (let item of items) {
    returned.push((yield mapper(item)));
  }

  return returned;
}