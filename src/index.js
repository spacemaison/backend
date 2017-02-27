import { createApp } from './app'
import * as constants from './constants'
import { runDatabaseTask, runDatabaseTransaction } from './db'
import * as routes from './routes/index'

if (require.main === module) {
  createApp().listen(constants.SERVER_PORT)
  console.log('\n\t Space Watch Backend started...')
}

export {
  constants,
  createApp,
  runDatabaseTask,
  runDatabaseTransaction,
  routes
}
