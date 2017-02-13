import { models } from 'space-maison-shared'
const { Gallery, GalleryItem, Image } = models

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

  let galleryItems = (yield galleries.map(gallery =>
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
    ))
    .map(items => items.map(item => new GalleryItem({
      __proto__: item,
      image: new Image({ urls: item.urls, sizes: item.sizes })
    })))

  return galleries.map((gallery, index) => new Gallery({
    __proto__: gallery,
    items: galleryItems[index]
  }))
}
