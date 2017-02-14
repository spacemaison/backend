/* globals describe, it, beforeEach */
import { expect } from 'chai'
import { models } from 'space-maison-shared'
import * as featured from '../../../src/routes/stories/featured'

describe('route handlers for news stories', () => {
  let connection

  beforeEach(() => {
    connection = {
      query (...args) {
        connection.query.args = args
        connection.query.callcount = connection.query.callcount || 0
        connection.query.callcount += 1
        return connection.query.returned
      }
    }
  })

  it('gets featured stories', () => {

  })
})
