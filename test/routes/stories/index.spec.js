/* globals describe, it, beforeEach */
import { expect } from 'chai'
import * as stories from '../../../src/routes/stories/index'

describe('route handlers for stories', () => {
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

  it('gets all stories', () => {
    let gen = stories.getAll(connection)
    let returned = {}

    while (!returned.done) {
      returned = gen.next([])
    }

    expect(returned.value).to.deep.equal({
      news: [],
      launches: []
    })
  })
})
