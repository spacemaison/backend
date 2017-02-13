import { models } from 'space-watch-shared'

const { Image, NewsStory } = models

export function * getNews (connection) {
  const news = yield connection.query(`
    select
      "description",
      "url",
      (image).urls,
      (image).descriptions,
      (image).sizes
    from
      news_stories,
      selected_stories
    where
      selected_stories.type = 'news' and selected_stories.id = news_stories.url
    order by
      news_stories.date DESC limit 25
  `)

  return news.map(news => new NewsStory({
    __proto__: news,

    image: new Image({
      urls: news.urls,
      descriptions: news.descriptions,
      sizes: news.sizes
    })
  }))
}
