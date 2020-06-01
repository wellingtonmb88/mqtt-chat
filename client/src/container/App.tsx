import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.svg'
import MQTTService from '../service/MQTT'
import { Widget, addResponseMessage, toggleWidget } from 'react-chat-widget'
import '../styles/App.css'
import 'react-chat-widget/lib/styles.css'

let mqttService: any
function App() {

  const [name, setName] = useState('')
  const [showChat, setShowChat] = useState(false)

  useEffect(() => { 
    addResponseMessage(`Welcome to this awesome chat! `)
    return () => {
      mqttService?.closeConnection()
    }
  }, [])

  const handleNewUserMessage = (newMessage: any) => {
    mqttService?.sendMessage(newMessage)
  }

  const handleError = (error: any) => {
    console.error(error)
    alert(error)
  }

  const handleMessage = (userName: string, message: string) => {
    addResponseMessage(`${userName}: ${message}`)
  }

  const handleSubmit = (event: any) => {
    event && event.preventDefault()
    setShowChat(true)
    toggleWidget()
    mqttService = MQTTService.getInstance(name, handleError)
    mqttService.onMessage(handleMessage)
  }

  return (
    <div className='App'>
      <h1>Welcome to Awesome Chat!</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='nickname'
          placeholder='Enter your Nickname...'
          value={name}
          onChange={(event) => setName(event.target.value)} />
        <input type='submit' value='Enter' />
      </form>
      {showChat && <Widget
        handleNewUserMessage={handleNewUserMessage}
        profileAvatar={logo}
        title='Awesome Chat'
        subtitle={`Let's chat ${name}`}
        showTimeStamp
        fullScreenMode
        showCloseButton={false}
        handleSubmit={(args: any) => args}
      />}
    </div>
  )
}

export default App
