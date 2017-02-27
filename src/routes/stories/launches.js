import { models } from 'space-maison-shared'

const { Image, Launches } = models
const {
  LaunchAgency,
  LaunchStory,
  LaunchLocation,
  LaunchPad,
  LaunchMission,
  LaunchRocket,
  LaunchRocketFamily } = Launches

export function * getLaunches (connection) {
  let launches = yield connection.query(`
    select
      launches.id,
      "infoURLs",
      location,
      pads,
      missions,
      rocket,
      status,
      "videoURLs",
      "windowStart",
      "windowEnd"
    from
      launches,
      selected_stories
    where
      selected_stories.type = 'launch' and
      selected_stories.id = cast (launches.id as text)
    order by
      "windowStart" DESC limit 25
  `)

  return yield mapAsync(launches, function * (launch) {
    return new LaunchStory({
      __proto__: launch,

      location: yield getLaunchLocation(connection, launch.location),
      pads: yield getLaunchPads(connection, launch.pads || []),
      missions: yield getLaunchMissions(connection, launch.missions || []),
      rocket: yield getLaunchRocket(connection, launch.rocket)
    })
  })
}

export function * getLaunchRocket (connection, rocketId) {
  const rocket = yield connection.one(`
    select
      configuration,
      family,
      name,
      "wikiURL",
      "infoURLs",
      (image).urls,
      (image).descriptions,
      (image).sizes
    from launch_rockets
    where id = ${rocketId}
  `)

  return new LaunchRocket({
    __proto__: rocket,
    image: new Image({ __proto__: rocket }),
    family: yield getLaunchRocketFamily(connection, rocket.family)
  })
}

export function * getLaunchRocketFamily (connection, familyId) {
  const family = yield connection.one(`
    select agencies, name from launch_rocket_families where id = ${familyId}
  `)

  return new LaunchRocketFamily({
    __proto__: family,
    agencies: yield getLaunchAgencies(connection, family.agencies || [])
  })
}

export function * getLaunchPads (connection, padIds) {
  return yield mapAsync(padIds, getLaunchPad.bind(null, connection))
}

export function * getLaunchPad (connection, padId) {
  return new LaunchPad(yield connection.one(`
    select
      "latitude",
      "longitude",
      "padType",
      "name",
      "mapURL",
      "retired",
      "wikiURL"
    from launch_pads
    where id = ${padId}
  `))
}

export function * getLaunchMissions (connection, missionIds) {
  return yield mapAsync(missionIds, getLaunchMission.bind(null, connection))
}

export function * getLaunchMission (connection, missionId) {
  return new LaunchMission(yield connection.one(`
    select agencies, description, "infoURLs", "wikiURL", name, type
    from launch_missions
    where id = ${missionId}
  `))
}

export function * getLaunchLocation (connection, locationId) {
  return new LaunchLocation(yield connection.one(`
    select name, "countryCode", "infoURLs", "wikiURL"
    from launch_locations
    where id = ${locationId}
  `))
}

export function * getLaunchAgencies (connection, agencies) {
  return yield mapAsync(agencies, getLaunchAgency.bind(null, connection))
}

export function * getLaunchAgency (connection, agencyId) {
  return new LaunchAgency(yield connection.one(`
    select abbrev, "countryCode", "infoURLs", name, type, "wikiURL"
    from launch_agencies
    where id = ${agencyId}
  `))
}

function * mapAsync (items, mapper) {
  let returned = []

  for (let item of items) {
    returned.push(yield mapper(item))
  }

  return returned
}
