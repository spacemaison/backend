import { getFeatured } from './featured'
import { getNews } from './news'
import { getLaunches } from './launches'

export {
  getFeatured,
  getNews,
  getLaunches
}

export function * getAll (connection) {
  return {
    featured: yield * getFeatured(connection),
    news: yield * getNews(connection),
    launches: yield * getLaunches(connection)
  }
}
