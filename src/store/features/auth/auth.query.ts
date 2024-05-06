import { createApi } from '@reduxjs/toolkit/query/react'

import { createBaseQueryWithAuth } from '../../utils'
import { ILoginPayload } from './auth.type'

export const authApi = createApi({
  baseQuery: createBaseQueryWithAuth,
  reducerPath: 'auth',
  tagTypes: ['Auth'],
  endpoints: (build) => ({
    login: build.mutation<{ data: { token: string }}, ILoginPayload>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body
      }),
      transformErrorResponse(baseQueryReturnValue) {
        return (baseQueryReturnValue.data as { error: string }).error
      }
    }),
  }),
})

export const {
  useLoginMutation,
} = authApi
