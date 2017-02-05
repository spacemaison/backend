import 'babel-polyfill'

import express from 'express'
import co from 'co'
import * as stories from './routes/stories/index'
import { getDatabaseConnection, SERVER_PORT } from './constants'

let app = express()

// FIXME: This is impossible to test. It's also likely really inefficient to
// open a new connection to the database for every request.
// To fix this I should either find logging/async middleware for express or
// find that other library that handles things using generators/async by default

app.get('/stories', (request, response) => {
  console.log('\t - Stories request')

  return co(function * () {
    let connection
    try {
      connection = yield getDatabaseConnection()

      response.json(yield stories.getAll(connection))
      console.log('\t - Stories request finished')
    } catch (e) {
      console.error(e.stack)
      response.status(400).end()
    } finally {
      console.log('\t - Stories request finally finished')
    }
  })
})

app.get('/stories/:type/:id', (request, response) => {
  const { id, type } = request.params

  console.log(`\t - Stories request type: ${type}, for id: ${id}`)

  return co(function * () {
    let connection

    try {
      connection = yield getDatabaseConnection()

      switch (request.params.type) {
        case 'galleries':
          const idInt = Number.parseInt(id)
          response.json(yield stories.getGalleries(connection, idInt))
          break

      }
    } catch (e) {
      console.error(e.stack)
      response.status(400).end()
    } finally {
      console.log('\t - Stories request type: ' + request.params.type + ' finally finished')
    }
  })
})

app.get('/stories/:type', (request, response) => {
  console.log('\t - Stories request type: ' + request.params.type)

  return co(function * () {
    let connection

    try {
      connection = yield getDatabaseConnection()

      switch (request.params.type) {
        case 'news':
          response.json(yield stories.getNews(connection))
          break
        case 'launches':
          response.json(yield stories.getLaunches(connection))
          break
        case 'featured':
          response.json(yield stories.getFeatured(connection))
          break
        case 'media':
          response.json({})
          break
        case 'galleries':
          response.json(yield stories.getGalleries(connection))
          break
        default:
          console.log('Unexpected request')
          response.status(404).end()
          break
      }
      console.log('\t - Stories request type: ' + request.params.type + ' finished')
    } catch (e) {
      console.error(e.stack)
      response.status(400).end()
    } finally {
      console.log('\t - Stories request type: ' + request.params.type + ' finally finished')
    }
  })
})

app.listen(SERVER_PORT)

console.log('\n\t Space Watch Backend started...')
