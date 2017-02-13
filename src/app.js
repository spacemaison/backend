import express from 'express'
import co from 'co'
import * as stories from './routes/stories/index'
import { getDatabaseConnection } from './constants'

export function createApp (createServer = express, logger = console) {
  let app = createServer()

  // FIXME: This is impossible to test. It's also likely really inefficient to
  // open a new connection to the database for every request.
  // To fix this I should either find logging/async middleware for express or
  // find that other library that handles things using generators/async by default

  app.get('/stories', (request, response) => {
    logger.log('\t - Stories request')

    return co(function * () {
      let connection
      try {
        connection = yield getDatabaseConnection()

        response.json(yield stories.getAll(connection))
        logger.log('\t - Stories request finished')
      } catch (e) {
        logger.error(e.stack)
        response.status(400).end()
      } finally {
        logger.log('\t - Stories request finally finished')
      }
    })
  })

  app.get('/stories/:type/:id', (request, response) => {
    const { id, type } = request.params

    logger.log(`\t - Stories request type: ${type}, for id: ${id}`)

    return co(function * () {
      let connection

      try {
        connection = yield getDatabaseConnection()

        switch (request.params.type) {
          case 'galleries':
            const idInt = Number.parseInt(id)
            const galleries = yield stories.getGalleries(connection, idInt)

            response.json(galleries[0] || {})
            break

        }
      } catch (e) {
        logger.error(e.stack)
        response.status(400).end()
      } finally {
        logger.log('\t - Stories request type: ' + request.params.type + ' finally finished')
      }
    })
  })

  app.get('/stories/:type', (request, response) => {
    logger.log('\t - Stories request type: ' + request.params.type)

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
            response.json(yield stories.getMedia(connection))
            break
          case 'galleries':
            response.json(yield stories.getGalleries(connection))
            break
          default:
            logger.log('Unexpected request')
            response.status(404).end()
            break
        }
        logger.log('\t - Stories request type: ' + request.params.type + ' finished')
      } catch (e) {
        logger.error(e.stack)
        response.status(400).end()
      } finally {
        logger.log('\t - Stories request type: ' + request.params.type + ' finally finished')
      }
    })
  })

  return app
}
