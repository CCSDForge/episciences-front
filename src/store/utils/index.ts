import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const createBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_ROOT_ENDPOINT
});

export const createBaseQueryWithJsonAccept = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_ROOT_ENDPOINT,
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json')

    return headers;
  }
});