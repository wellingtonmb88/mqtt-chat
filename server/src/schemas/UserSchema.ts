import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  user_id: String,
  user_name: String,
  date: String,
  connected: {
    type: Boolean,
    default: true
  }
})

export default mongoose.model('User', UserSchema)