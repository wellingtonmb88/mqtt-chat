import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  user_id: String,
  user_name: String,
  message: String,
  date: String,
})

export default mongoose.model('Message', MessageSchema)