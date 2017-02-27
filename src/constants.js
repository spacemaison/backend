export const SERVER_PORT = process.env.SPACE_MAISON_SERVER_PORT || 3000
export const DATABASE_PORT = process.env.SPACE_MAISON_DATABASE_PORT || 5432
export const DATABASE_HOST = process.env.SPACE_MAISON_DATABASE_HOST || 'localhost'
export const DATABASE_USER = process.env.SPACE_MAISON_DATABASE_USER || ''
export const DATABASE_PASSWORD = process.env.SPACE_MAISON_DATABASE_PW || ''
export const DATABASE_NAME =
    process.env.SPACE_MAISON_DATABASE_NAME || 'space_maison'

export const DATABASE_OPTIONS = Object.freeze({
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  database: DATABASE_NAME,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD
})

// __DB_SCHEMA__
export const NEWS_STORY_TABLE_NAME = 'news_stories'
export const NEWS_STORY_SCHEMA = `
  primary key (url, date),
  "date" timestamp default current_timestamp,
  "description" text,
  "image" image,
  "rank" integer,
  "source" text,
  "type" text,
  "title" text,
  "url" text
`

export const LAUNCH_STORY_TABLE_NAME = 'launches'
export const LAUNCH_STORY_SCHEMA = `
  id integer primary key,
  missions integer array,
  status text,
  location integer,
  "modified" timestamp default current_timestamp,
  pads integer array,
  rocket integer,
  "windowStart" timestamp,
  "windowEnd" timestamp,
  "videoURLs" text array,
  "infoURLs" text array
`

export const LAUNCH_AGENCY_TABLE_NAME = 'launch_agencies'
export const LAUNCH_AGENCY_SCHEMA = `
  id integer primary key,
  name text,
  "infoURLs" text array,
  "countryCode" text,
  "wikiURL" text,
  abbrev text,
  type text
`

export const LAUNCH_MISSIONS_TABLE_NAME = 'launch_missions'
export const LAUNCH_MISSIONS_SCHEMA = `
  id integer primary key,
  description text,
  agencies integer array,
  "infoURLs" text array,
  "wikiURL" text,
  launch integer,
  name text,
  type text
`

export const LAUNCH_LOCATION_TABLE_NAME = 'launch_locations'
export const LAUNCH_LOCATION_SCHEMA = `
  id integer primary key,
  name text,
  "countryCode" text,
  "infoURLs" text array,
  "wikiURL" text
`

export const LAUNCH_PAD_TABLE_NAME = 'launch_pads'
export const LAUNCH_PAD_SCHEMA = `
  id integer primary key,
  latitude text,
  longitude text,
  "padType" text,
  name text,
  "mapURL" text,
  retired boolean,
  "locationId" integer,
  agencies integer array,
  "wikiURL" text
`

export const LAUNCH_ROCKET_TABLE_NAME = 'launch_rockets'
export const LAUNCH_ROCKET_SCHEMA = `
  "id" integer primary key,
  "configuration" text,
  "name" text,
  "defaultPads" integer array,
  "family" integer,
  "wikiURL" text,
  "infoURLs" text array,
  "image" image
`

export const LAUNCH_ROCKET_FAMILY_TABLE_NAME = 'launch_rocket_families'
export const LAUNCH_ROCKET_FAMILY_SCHEMA = `
  id integer primary key,
  name text,
  agencies integer array
`

export const MEDIA_STORY_TABLE_NAME = 'media_stories'
export const MEDIA_STORY_SCHEMA = `
  "id" serial primary key,
  "date" timestamp default current_timestamp,
  "description" text,
  "image" image,
  "title" text,
  "type" text,
  "url" text
`

export const GALLERY_ITEM_TABLE_NAME = 'gallery_items'
export const GALLERY_ITEM_SCHEMA = `
  "id" serial primary key,
  "date" timestamp unique default current_timestamp,
  "credit" text array,
  "description" text,
  "image" image,
  "infoURL" text,
  "license" text,
  "source" text,
  "title" text
`

export const GALLERY_TABLE_NAME = 'galleries'
export const GALLERY_SCHEMA = `
  "id" serial primary key,
  "date" timestamp unique default current_timestamp,
  "description" text,
  "title" text,
  "items" integer array,
  "source" text
`

export const SELECTED_STORY_TABLE_NAME = 'selected_stories'
export const SELECTED_STORY_SCHEMA = `
  primary key (id, type),
  "date" timestamp unique default current_timestamp,
  "type" story_type,
  "id" text
`

export const FEATURED_STORY_TABLE_NAME = 'featured_stories'
export const FEATURED_STORY_SCHEMA = `
  primary key ("url", "createdAt"),
  "createdAt" timestamp default current_timestamp,
  "image" image,
  "description" text,
  "title" text,
  "url" text
`

// __DB_TYPES__
export const STORY_TYPE_NAME = 'story_type'
export const STORY_TYPE = `as enum (
  'news', 'launch', 'featured', 'media'
)`

export const IMAGE_TYPE_NAME = 'image'
export const IMAGE_TYPE = `as (
  descriptions text array,
  urls text array,
  sizes integer[][]
)`
