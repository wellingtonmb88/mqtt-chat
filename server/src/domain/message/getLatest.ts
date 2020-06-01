
import moment from 'moment'
import MessageSchema from '../../schemas/MessageSchema'
import UserSchema from '../../schemas/UserSchema'

export default async () => {
  const result: any[] = await MessageSchema.find({}).sort({ _id: -1 }).limit(20)
  let messages: any = []
  for (let m of result.reverse()) {
    const user: any = await UserSchema.findOne({ user_id: m.user_id })
    const status = user && user.connected ? '' : '(DISCONNECTED)'
    const time = moment(m.date).calendar()
    messages.push({
      user_id: m.user_id,
      user_name: `${m.user_name} ${status}`,
      message: `${m.message} [${time}]`
    })
  }
  return messages
}