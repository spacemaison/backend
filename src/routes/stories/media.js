import { models } from 'space-watch-shared'

const { Image, MediaStory } = models

export function * getMedia (connection) {
  const stories = yield connection.query(`
    select
      "date",
      "description",
      "title",
      "url",
      (image).urls,
      (image).sizes
    from
      media_stories
    order by
      media_stories.date DESC limit 25
  `)

  return stories.map(story => new MediaStory({
    __proto__: story,
    image: new Image({
      urls: story.urls,
      sizes: story.sizes
    })
  }))
}
