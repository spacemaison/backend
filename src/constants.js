import postgres from 'pg-promise'

export const SERVER_PORT = process.env.SPACE_MAISON_SERVER_PORT || 3000
export const DATABASE_PORT = process.env.SPACE_MAISON_DATABASE_PORT || 5432
export const DATABASE_HOST = process.env.SPACE_MAISON_DATABASE_HOST || 'localhost'
export const DATABASE_USER = process.env.SPACE_MAISON_DATABASE_USER || ''
export const DATABASE_PASSWORD = process.env.SPACE_MAISON_DATABASE_PW || ''
export const DATABASE_NAME =
    process.env.SPACE_MAISON_DATABASE_NAME || 'space_maison'

export const DATABASE_OPTIONS = Object.freeze({
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  database: DATABASE_NAME,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD
})

let db
export function getDatabase () {
  if (!db) {
    db = postgres()(DATABASE_OPTIONS)
  }

  return db
}

let connection
export function getDatabaseConnection () {
  if (connection) return Promise.resolve(connection)

  return getDatabase().connect().then(_c => { connection = _c; return _c })
}
