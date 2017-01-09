import { models } from 'space-watch-shared'

const { NewsStory } = models

export function * getNews (connection) {
  const news = yield connection.query(`
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
  `)

  return news.map(news => new NewsStory(news))
}
