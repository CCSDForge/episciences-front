import { IUser } from '../../../types/user'

export interface IAuthState {
  token?: string
}

export type ILoginPayload = Pick<IUser, 'email' | 'password'>