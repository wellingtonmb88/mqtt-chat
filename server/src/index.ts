import config from './config'
import App from './App'

const start = async () => {
  try {
    await App.listen(config.app.port, config.app.host)
  } catch (err) {
    App.log.error(err)
    process.exit(1)
  }
}

process.on("uncaughtException", error => {
  console.error(error)
})
process.on("unhandledRejection", error => {
  console.error(error)
})

start()