/* globals describe, it, beforeEach */
import { expect } from 'chai'
import { models } from 'space-maison-shared'
import * as stories from '../../../src/routes/stories/launches'

describe.skip('route handlers for launch stories', () => {
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

  it('gets all launch stories', () => {
    let gen = stories.getLaunches(connection)
    let story = new models.LaunchStory({ url: 'url' })
    let launches = [ story ]

    connection.query.returned = launches

    expect(gen.next().value).to.equal(launches)
    expect(connection.query.args).to.deep.equal([
      '\n    select * from launch_stories order by time DESC limit 25\n  '
    ])
    expect(gen.next(launches).value).to.deep.equal([ story ])
  })
})
