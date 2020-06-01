import mqtt from 'mqtt'
const websocketUrl = 'ws://0.0.0.0:9001'
const TOPIC_NEW_MESSAGE = 'MQTT/TOPIC_NEW_MESSAGE'
const TOPIC_NEW_CONNECTION = 'MQTT/TOPIC_NEW_CONNECTION'
const TOPIC_CLOSE_CONNECTION = 'MQTT/TOPIC_CLOSE_CONNECTION'
const TOPIC_LATEST_MESSAGES = 'MQTT/TOPIC_LATEST_MESSAGES'
const TOPIC_CLIENT_HEART_BEAT = 'MQTT/TOPIC_CLIENT_HEART_BEAT'
const TOPIC_CLIENT_IS_ALIVE = 'MQTT/TOPIC_CLIENT_IS_ALIVE'
const TOPIC_CLIENT_DISCONNECTED = 'MQTT/TOPIC_CLIENT_DISCONNECTED'

class MQTTService {

  private USER_ID = 'USER_ID_' + new Date().getTime()

  private static instance: MQTTService
  public client: mqtt.MqttClient
  private constructor(public nickname: string, errorHandler: any) {
    this.client = mqtt.connect(websocketUrl)

    this.client.on('error', (err: any) => {
      errorHandler(`Connection to ${websocketUrl} failed ${err}`)
      this.publishMessage(TOPIC_CLOSE_CONNECTION, 'Disconnected!')
      this.client.end()
    })


    this.client.on('connect', () => {
      console.log(`Connection to ${websocketUrl} success`)
      this.client.subscribe(TOPIC_NEW_MESSAGE)
      this.client.subscribe(TOPIC_CLOSE_CONNECTION)
      this.client.subscribe(TOPIC_LATEST_MESSAGES)
      this.client.subscribe(TOPIC_CLIENT_IS_ALIVE)
      this.client.subscribe(TOPIC_CLIENT_DISCONNECTED)
      this.publishMessage(TOPIC_NEW_CONNECTION, 'Connected!')
      setTimeout(() => {
        this.client.subscribe(TOPIC_NEW_CONNECTION)
      }, 500)
    })
  }

  static getInstance(nickname: string, errorHandler: any) {
    if (!MQTTService.instance) {
      MQTTService.instance = new MQTTService(nickname, errorHandler)
      return MQTTService.instance
    }
    return MQTTService.instance
  }

  sendMessage = (message: string) => {
    this.publishMessage(TOPIC_NEW_MESSAGE, message)
  }

  publishMessage = (topic: string, message: string) => {
    this.client.publish(topic, JSON.stringify({ user_id: this.USER_ID, user_name: this.nickname, message }))
  }

  onMessage = (callBack: any) => {
    this.client.on('message', (topic: any, message: any, packet: any) => {
      const json = JSON.parse(message.toString())
      if (topic === TOPIC_CLIENT_IS_ALIVE) {
        console.log(TOPIC_CLIENT_IS_ALIVE)
        this.publishMessage(TOPIC_CLIENT_HEART_BEAT, 'true')
      } else if (json.user_id === this.USER_ID) {
        return
      } else if (topic === TOPIC_LATEST_MESSAGES) {
        json.forEach((object: any) => {
          callBack(object.user_name, object.message)
        })
        this.client.unsubscribe(TOPIC_LATEST_MESSAGES)
      } else {
        callBack(json.user_name, json.message)
      }
    })
  }

  closeConnection = () => {
    this.publishMessage(TOPIC_CLOSE_CONNECTION, 'Disconnected!')
    this.client.unsubscribe(TOPIC_NEW_MESSAGE)
    this.client.unsubscribe(TOPIC_CLOSE_CONNECTION)
    this.client.unsubscribe(TOPIC_NEW_CONNECTION)
    this.client.end()
  }

}

export default MQTTService