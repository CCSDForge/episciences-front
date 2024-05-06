import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '..'

export const createBaseQueryWithAuth = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_ROOT_ENDPOINT,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).authReducer.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});