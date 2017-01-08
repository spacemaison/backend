import postgres from 'pg-promise'

export const DB_SERVER_URL = 'postgres://localhost/space_watch'
export const SERVER_PORT = 3000

let db
export function getDatabase () {
  if (!db) {
    db = postgres()(DB_SERVER_URL)
  }

  return db
}
