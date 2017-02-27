import postgres from 'pg-promise'
import co from 'co'
import {
  DATABASE_OPTIONS,
  IMAGE_TYPE,
  IMAGE_TYPE_NAME,
  FEATURED_STORY_SCHEMA,
  FEATURED_STORY_TABLE_NAME,
  GALLERY_SCHEMA,
  GALLERY_TABLE_NAME,
  LAUNCH_AGENCY_SCHEMA,
  LAUNCH_AGENCY_TABLE_NAME,
  LAUNCH_LOCATION_SCHEMA,
  LAUNCH_LOCATION_TABLE_NAME,
  LAUNCH_MISSIONS_SCHEMA,
  LAUNCH_MISSIONS_TABLE_NAME,
  LAUNCH_PAD_SCHEMA,
  LAUNCH_PAD_TABLE_NAME,
  LAUNCH_STORY_SCHEMA,
  LAUNCH_STORY_TABLE_NAME,
  LAUNCH_ROCKET_SCHEMA,
  LAUNCH_ROCKET_TABLE_NAME,
  LAUNCH_ROCKET_FAMILY_SCHEMA,
  LAUNCH_ROCKET_FAMILY_TABLE_NAME,
  MEDIA_STORY_SCHEMA,
  MEDIA_STORY_TABLE_NAME,
  NEWS_STORY_SCHEMA,
  NEWS_STORY_TABLE_NAME,
  SELECTED_STORY_SCHEMA,
  SELECTED_STORY_TABLE_NAME,
  STORY_TYPE,
  STORY_TYPE_NAME
} from './constants'

let pgPromise
let db

function getPostgres () {
  if (!pgPromise) {
    pgPromise = postgres()
  }
  return pgPromise
}

function getDatabase () {
  if (!db) {
    db = getPostgres()(DATABASE_OPTIONS)
  }

  return db
}

export function * runDatabaseTask (cb, closeAfter) {
  return yield * run('task', closeAfter, cb)
}

export function * runDatabaseTransaction (cb, closeAfter) {
  return yield * run('tx', closeAfter, cb)
}

function * run (type, closeAfter, cb) {
  yield getDatabase().task(db => co(function * () {
    yield createDatabaseTypes(db)
    yield createDatabaseTables(db)
  }))

  try {
    yield getDatabase()[type](cb)
  } catch (error) {
    console.error(error.stack)
  }

  if (closeAfter) {
    pgPromise.end()
  }
}

let connection
export function * getDatabaseConnection () {
  if (connection) return connection
  else connection = yield (getDatabase().connect())

  yield createDatabaseTypes(connection)
  yield createDatabaseTables(connection)

  return connection
}

export function * createDatabaseTypes () {
  yield createTypeIfNotExists(db, STORY_TYPE_NAME, STORY_TYPE)
  yield createTypeIfNotExists(db, IMAGE_TYPE_NAME, IMAGE_TYPE)
}

export function * createDatabaseTables () {
  yield createTableIfNotExists(
      db, FEATURED_STORY_TABLE_NAME, FEATURED_STORY_SCHEMA)
  yield createTableIfNotExists(
      db, GALLERY_TABLE_NAME, GALLERY_SCHEMA)
  yield createTableIfNotExists(
      db, LAUNCH_AGENCY_TABLE_NAME, LAUNCH_AGENCY_SCHEMA)
  yield createTableIfNotExists(
      db, LAUNCH_LOCATION_TABLE_NAME, LAUNCH_LOCATION_SCHEMA)
  yield createTableIfNotExists(
      db, LAUNCH_MISSIONS_TABLE_NAME, LAUNCH_MISSIONS_SCHEMA)
  yield createTableIfNotExists(
      db, LAUNCH_PAD_TABLE_NAME, LAUNCH_PAD_SCHEMA)
  yield createTableIfNotExists(
      db, LAUNCH_STORY_TABLE_NAME, LAUNCH_STORY_SCHEMA)
  yield createTableIfNotExists(
      db, LAUNCH_ROCKET_TABLE_NAME, LAUNCH_ROCKET_SCHEMA)
  yield createTableIfNotExists(
      db, LAUNCH_ROCKET_FAMILY_TABLE_NAME, LAUNCH_ROCKET_FAMILY_SCHEMA)
  yield createTableIfNotExists(
      db, SELECTED_STORY_TABLE_NAME, SELECTED_STORY_SCHEMA)
  yield createTableIfNotExists(
      db, MEDIA_STORY_TABLE_NAME, MEDIA_STORY_SCHEMA)
  yield createTableIfNotExists(
      db, NEWS_STORY_TABLE_NAME, NEWS_STORY_SCHEMA)
}

export function * createTableIfNotExists (db, name, schema) {
  if (!(yield hasTable(db, name))) {
    yield db.none(`create table ${name} (${schema})`)
    return true
  }

  return false
}

export function * createTypeIfNotExists (db, name, schema) {
  if (!(yield hasType(db, name))) {
    yield db.none(`create type ${name} ${schema}`)
    return true
  }

  return false
}

export function * hasTable (db, name) {
  const { exists } = yield db.one(`
    select exists (
      select 1
      from information_schema.tables
      where table_name = '${name}'
    )
  `)

  return exists
}

export function * hasType (db, name) {
  const { exists } = yield db.one(`
    select exists (
      select 1
      from pg_type
      where typname = '${name}'
    )
  `)

  return exists
}
