import 'babel-polyfill'

import express from 'express'
import co from 'co'
import * as stories from './routes/stories/index'
import { getDatabase, SERVER_PORT } from './constants'

let app = express()

// FIXME: This is impossible to test. It's also likely really inefficient to
// open a new connection to the database for every request.

app.get('/stories', (request, response) => {
  console.log('\t - Stories request')

  co(function * () {
    let connection
    try {
      connection = yield getDatabase().connect()

      response.json(yield stories.getAll(connection))
    } catch (e) {
      console.error(e.stack)
      response.status(400).end()
    } finally {
      if (connection) {
        connection.close()
      }
    }
  })
})

app.get('/stories/:type', (request, response) => {
  console.log('\t - Stories request type: ' + request.params.type)

  co(function * () {
    let connection

    try {
      connection = yield getDatabase().connect()

      switch (request.params.type) {
        case 'news':
          response.json(yield stories.getNews(connection))
          break
        case 'launches':
          response.json(yield stories.getLaunches(connection))
          break
        default:
          response.status(404).end()
          break
      }
    } catch (e) {
      console.error(e.stack)
      response.status(400).end()
    } finally {
      if (connection) {
        connection.close()
      }
    }
  })
})

app.listen(SERVER_PORT)

console.log('\n\t Space Watch Backend started...')
