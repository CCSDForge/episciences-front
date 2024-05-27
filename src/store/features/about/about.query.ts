import { createApi } from '@reduxjs/toolkit/query/react'

import { IPage } from '../../../types/page'
import { createBaseQueryWithJsonAccept } from '../../utils'

export const aboutApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'about',
  tagTypes: ['About'],
  endpoints: (build) => ({
    fetchAboutPage: build.query<IPage | undefined, string>({
      query: (rvcode: string) => ({ url: `pages?page_code=about&rvcode=${rvcode}` }),
      transformResponse(baseQueryReturnValue) {
        const typedBaseQueryReturnValue = baseQueryReturnValue as IPage[]
        return typedBaseQueryReturnValue.length > 0 ? typedBaseQueryReturnValue[0] : undefined
      },
    }),
  }),
})

export const {
  useFetchAboutPageQuery,
} = aboutApi
