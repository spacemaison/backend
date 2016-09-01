import { expect } from 'chai'
import { models } from 'space-watch-shared'
import * as stories from '../../src/routes/stories'

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

  it('gets news stories', () => {
    let gen = stories.getNews(connection)
    let news = [ new models.NewsStory({ url: 'url' }) ]
    let value

    connection.query.returned = news

    expect(gen.next().value).to.equal(news)
    expect(connection.query.args).to.deep.equal([
      '\n    select * from news_stories order by created_at DESC limit 25\n  '
    ])
    expect(gen.next(news).value).to.deep.equal([
      new models.NewsStory({ url: 'url' })
    ])
  })

  it('gets launch stories', () => {
    let gen = stories.getLaunches(connection)
    let story = new models.LaunchStory({ url: 'url' })
    let launches = [ story ]
    let value

    connection.query.returned = launches

    expect(gen.next().value).to.equal(launches)
    expect(connection.query.args).to.deep.equal([
      '\n    select * from launch_stories order by time DESC limit 25\n  '
    ])
    expect(gen.next(launches).value).to.deep.equal([ story ])
  })

  it('gets all stories', () => {
    let gen = stories.getAll(connection)

    gen.next()
    gen.next([])

    expect(gen.next([]).value).to.deep.equal({
      news: [],
      launches: []
    })
  })
})
