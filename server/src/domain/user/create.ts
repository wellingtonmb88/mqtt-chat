
import moment from 'moment'
import UserSchema from '../../schemas/UserSchema'

export default async (data: any) => {
  try {
    const date = moment().format()
    const schema = new UserSchema({
      ...data,
      date,
    })
    await schema.save()
    return true
  } catch (err) {
    throw new Error(err.message)
  }
}