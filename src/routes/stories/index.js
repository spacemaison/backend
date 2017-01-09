import { getNews } from './news'
import { getLaunches } from './launches'

export {
  getNews,
  getLaunches
}

export function * getAll (connection) {
  return {
    news: yield * getNews(connection),
    launches: yield * getLaunches(connection)
  }
}
