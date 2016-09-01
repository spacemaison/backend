import { models } from 'space-watch-shared'

const { NewsStory, LaunchStory } = models

export function * getNews (connection) {
  const news = yield connection.query(`
    select * from news_stories order by created_at DESC limit 25
  `)

  return news.map(news => new NewsStory(news))
}

export function * getLaunches (connection) {
  const launches = yield connection.query(`
    select * from launch_stories order by time DESC limit 25
  `)

  return launches.map(launch => new LaunchStory(launch))
}

export function * getAll (connection) {
  return {
    news: yield * getNews(connection),
    launches: yield * getLaunches(connection)
  }
}
