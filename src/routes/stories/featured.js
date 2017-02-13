import { models } from 'space-maison-shared'
const { Image, FeaturedStory } = models

export function * getFeatured (connection) {
  const featured = yield connection.query(`
    select
      "url",
      "description",
      "title",
      (image).urls,
      (image).sizes
    from
      featured_stories,
      selected_stories
    where
      selected_stories.type = 'featured' and
      selected_stories.id = featured_stories.url
    order by
      "createdAt" DESC limit 3
  `)

  return featured.map(featured => new FeaturedStory({
    __proto__: featured,

    image: new Image({
      urls: featured.urls,
      sizes: featured.sizes
    })
  }))
}
