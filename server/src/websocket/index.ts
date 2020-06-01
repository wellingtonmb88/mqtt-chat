
import mqtt from 'mqtt'
import config from '../config'
import createMessage from '../domain/message/create'
import getLatestMessage from '../domain/message/getLatest'
import createUser from '../domain/user/create'
import getConnectedUsers from '../domain/user/getConnected'
import updateStatusUser from '../domain/user/updateStatus'


const TOPIC_NEW_MESSAGE = 'MQTT/TOPIC_NEW_MESSAGE'
const TOPIC_NEW_CONNECTION = 'MQTT/TOPIC_NEW_CONNECTION'
const TOPIC_CLOSE_CONNECTION = 'MQTT/TOPIC_CLOSE_CONNECTION'
const TOPIC_LATEST_MESSAGES = 'MQTT/TOPIC_LATEST_MESSAGES'
const TOPIC_CLIENT_HEART_BEAT = 'MQTT/TOPIC_CLIENT_HEART_BEAT'
const TOPIC_CLIENT_IS_ALIVE = 'MQTT/TOPIC_CLIENT_IS_ALIVE'
const TOPIC_CLIENT_DISCONNECTED = 'MQTT/TOPIC_CLIENT_DISCONNECTED'
const HEART_BEAT_TIME = 10000

export default async () => {

  const client = mqtt.connect(`mqtt://${config.MQTTService.host}:${config.MQTTService.port}`)
  let usersHB: any = []

  const heartBeat = async () => {
    const users = await getConnectedUsers()
    client.publish(TOPIC_CLIENT_IS_ALIVE, JSON.stringify({}))
    await setTimeout(async () => {
      if (users.length > 0) {
        await updateUsersStatus(users)
      }
      usersHB = []
      await heartBeat()
    }, HEART_BEAT_TIME)
  }

  const updateUsersStatus = async (users: any[]) => {
    const ids = users.map((u: any) => u.user_id)
    if (ids.length !== usersHB.length) {
      let updateUsers = []
      for (let u of users) {
        if (!usersHB.includes(u.user_id)) {
          updateUsers.push(u)
        }
      }
      for (let u of updateUsers) {
        await updateStatusUser(u.user_id)
        client.publish(TOPIC_CLIENT_DISCONNECTED, JSON.stringify({ user_id: u.user_id, user_name: u.user_name, message: 'DISCONNECTED!' }))
      }
    }

  }

  client.on('error', (err) => {
    console.error(`MQTT Connection failed`)
    client.end()
  })

  client.on('connect', async () => {
    console.log(`MQTT Connection success`)
    client.subscribe(TOPIC_NEW_MESSAGE)
    client.subscribe(TOPIC_CLOSE_CONNECTION)
    client.subscribe(TOPIC_CLIENT_HEART_BEAT)
    client.subscribe(TOPIC_NEW_CONNECTION)
    await heartBeat()
  })

  client.on('message', async (topic, msg) => {
    const message = JSON.parse(msg.toString())
    switch (topic) {
      case TOPIC_NEW_MESSAGE:
        console.log(TOPIC_NEW_MESSAGE, message)
        createMessage(message)
        break
      case TOPIC_CLOSE_CONNECTION:
        console.log(TOPIC_CLOSE_CONNECTION, message)
        break

      case TOPIC_NEW_CONNECTION:
        createUser(message)
        const messages = await getLatestMessage()
        console.log(TOPIC_NEW_CONNECTION, messages)
        client.publish(TOPIC_LATEST_MESSAGES, JSON.stringify(messages))
        break

      case TOPIC_CLIENT_HEART_BEAT:
        console.log(TOPIC_CLIENT_HEART_BEAT, message)
        usersHB.push(message.user_id)
        break

      default:
        console.error("TOPIC NOT FOUND!")
    }
  })



}