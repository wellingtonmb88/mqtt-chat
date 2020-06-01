
import moment from 'moment'
import MessageSchema from '../../schemas/MessageSchema'

export default async (data: any) => {
  try {
    const date = moment().format()
    const schema = new MessageSchema({
      ...data,
      date,
    })
    await schema.save()
    return true
  } catch (err) {
    throw new Error(err.message)
  }
}