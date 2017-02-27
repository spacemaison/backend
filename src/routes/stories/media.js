import { models } from 'space-maison-shared'

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
      media_stories,
      selected_stories
    where
      selected_stories.type = 'media' and
      selected_stories.id = cast (featured_stories.id as text)
    order by
      media_stories.id DESC limit 25
  `)

  return stories.map(story => new MediaStory({
    __proto__: story,
    image: new Image({
      urls: story.urls,
      sizes: story.sizes
    })
  }))
}
