import { models } from 'space-watch-shared'
const { Gallery, Image } = models

export function * getGalleries (connection, ids) {
  ids = Array.isArray(ids) ? ids : [ ids ].filter(id => id)

  const galleries = yield connection.query(`
    select
      id, date, title, description, items
    from
      galleries
    ${ids.length
      ? 'where ' + ids.map(id => `id = ${id}`).join(' or ')
      : ''
    }
    order by
      date DESC limit 10
  `)

  const items = yield galleries.map(gallery =>
    connection.query(`
      select
        id,
        (image).urls,
        (image).sizes,
        credit,
        license,
        title,
        description,
        date,
        "infoURL"
      from
        gallery_items
      where
        ${gallery.items.map(id => `id = ${id}`).join(' or ')}
    `)
  )

  return galleries.map((gallery, index) => new Gallery({
    __proto__: gallery,
    image: new Image({
      urls: gallery.urls,
      sizes: gallery.sizes
    }),
    items: items[index]
  }))
}
