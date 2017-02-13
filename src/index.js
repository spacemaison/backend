import { createApp } from './app'
import { SERVER_PORT } from './constants'
import * as routes from './routes/index'

if (require.main === module) {
  createApp().listen(SERVER_PORT)
  console.log('\n\t Space Watch Backend started...')
}

export {
  createApp,
  routes
}
