
import UserSchema from '../../schemas/UserSchema'

export default async () => {
  return await UserSchema.find({ connected: true })
}