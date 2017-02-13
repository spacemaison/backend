import { getFeatured } from './featured'
import { getGalleries } from './galleries'
import { getLaunches } from './launches'
import { getMedia } from './media'
import { getNews } from './news'

export {
  getFeatured,
  getGalleries,
  getLaunches,
  getMedia,
  getNews
}

export function * getAll (connection) {
  return {
    featured: yield * getFeatured(connection),
    galleries: yield * getGalleries(connection),
    launches: yield * getLaunches(connection),
    media: yield * getMedia(connection),
    news: yield * getNews(connection)
  }
}
