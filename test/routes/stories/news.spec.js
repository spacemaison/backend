/* globals describe, it, beforeEach */
import { expect } from 'chai'
import { models } from 'space-watch-shared'
import * as stories from '../../../src/routes/stories/news'

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

  it('gets news stories', () => {
    let gen = stories.getNews(connection)
    let news = [ new models.NewsStory({ url: 'url' }) ]

    connection.query.returned = news

    expect(gen.next().value).to.equal(news)
    expect(connection.query.args).to.deep.equal([ expectedQuery ])
    expect(gen.next(news).value).to.deep.equal([
      new models.NewsStory({ url: 'url' })
    ])
  })

  const expectedQuery = `
    select
      "description",
      "url",
      "thumbnailSource",
      "thumbnailDescription"
    from
      news_stories,
      selected_stories
    where
      selected_stories.type = 'news' and selected_stories.id = news_stories.url
    order by
      news_stories.created_at DESC limit 25
  `
})
