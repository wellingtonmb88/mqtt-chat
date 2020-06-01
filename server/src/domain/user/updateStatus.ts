
import UserSchema from '../../schemas/UserSchema'
export default async (id: any) => {

  const user: any = await UserSchema.findOne({ user_id: id })
  if (!user) {
    return
  }
  user.connected = false

  await user.save()
}