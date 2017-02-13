Space Maison Backend
====================

Space Maison is an aggregated space news and information application. A lot is amazing events are happening in space, NASA's sending probes into deep space, SpaceX is for the first time making re-usable rockets that have the promise to dramatically drop the price of entry, the Lunar X Prize competition rockets are launching, the next decade in Space is poised to be the most promising for the blah blah blah blah.... I'm tired of selling this shit. All this project does is provide a bunch of Restfull JSON endpoints that query into a PostgreSQL database. A brief documentation of the API follows below.

Overview
--------

The back end exposed as a collection of restfull JSON end points. The routing is (poorly) done in src/app.js and relies on methods in src/routes/\*.js to fulfill requests.

The methods in src/routes/\*.js are responsible for querying the database and returning results. They all loosely correspond to the JSON end points, so src/routes/news.js has a getNews method that corresponds with the 'stories/news' rest get method.

### End Points

The end points are documented below. They're listed with examples of returned data. The models classes listed can be found in the shared repository.

  - Get -> 'stories'
    ```
    {
      galleries: [
        GalleryItem { ... }
      ],
      featured: [
        FeaturedStory { ... },
        ...
      ],
      launches: [
        LaunchStory { ... },
        ...
      ],
      media: [
        MediaStory { ... },
        ...
      ],
      news: [
        NewsStory { ... },
        ...
      ],
    }
    ```
  - Get -> 'stories/galleries'
    ```
    [
      GalleryItem { ... },
      ...
    ]
    ```
  - Get -> 'stories/galleries/:id'
    ```
    GalleryItem { ... }
    ```
  - Get -> 'stories/featured'
    ```
    [
      FeaturedStory { ... },
      ...
    ]
    ```
  - Get -> 'stories/news'
    ```
    [
      NewsStory { ... },
      ...
    ]
    ```
  - Get -> 'stories/launches'
    ```
    [
      LaunchStory { ... },
      ...
    ]
    ```
