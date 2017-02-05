import { getFeatured } from './featured'
import { getGalleries } from './galleries'
import { getNews } from './news'
import { getLaunches } from './launches'

export {
  getFeatured,
  getGalleries,
  getNews,
  getLaunches
}

export function * getAll (connection) {
  return {
    featured: yield * getFeatured(connection),
    galleries: yield * getGalleries(connection),
    news: yield * getNews(connection),
    launches: yield * getLaunches(connection)
  }
}
