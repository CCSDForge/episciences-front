import { createApi } from '@reduxjs/toolkit/query/react'

import { createBaseQueryWithAuth } from '../../utils'
import { IUser } from '../../../types/user'

export const userApi = createApi({
  baseQuery: createBaseQueryWithAuth,
  reducerPath: 'user',
  tagTypes: ['User'],
  endpoints: (build) => ({
    fetchProfile: build.query<IUser, null>({
      query: () => ({ url: 'users/me' }),
      transformResponse(baseQueryReturnValue) {
        return (baseQueryReturnValue as { data: IUser }).data
      },
    }),
  }),
})

export const {
  useFetchProfileQuery,
} = userApi
