Overview
========

The back end exposed as a collection of restfull JSON end points. The routing is (poorly) done in src/index.js and relies on methods in src/routes/\*.js to fulfill requests.

The methods in src/routes/\*.js are responsible for querying the database and returning results. They all loosely correspond to the JSON end points, so src/routes/news.js has a getNews method that corresponds with the 'stories/news' rest get method.

End Points
----------

The end points are documented below. They're listed with examples of returned data.

  - Get -> 'stories'
    ```
    {
      news: [
        NewsStory { ... },
        ...
      ],
      launches: [
        LaunchStory { ... },
        ...
      ]
    }
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
