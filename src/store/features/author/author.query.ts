import { createApi } from '@reduxjs/toolkit/query/react'

import { IFacetAuthor, IAuthor } from '../../../types/author'
import { PaginatedResponse } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const authorApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'author',
  tagTypes: ['Author'],
  endpoints: (build) => ({
    fetchAuthors: build.query<{ data: IAuthor[], totalItems: number }, { rvcode: string, page: number, itemsPerPage: number, search?: string, letter?: string; }>({
      query: ({ rvcode, page, itemsPerPage, search, letter } :{ rvcode: string, page: number, itemsPerPage: number; search?: string, letter?: string; }) => {
        const baseUrl = `browse/authors?page=${page}&itemsPerPage=${itemsPerPage}&code=${rvcode}`
        let queryParams = '';

        if (search) queryParams += `&search=${search}`;
        
        if (letter) queryParams += `&letter=${letter}`;
        
        return `${baseUrl}${queryParams}`;
      },
      transformResponse(baseQueryReturnValue: PaginatedResponse<IFacetAuthor>) {
        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member']).map((author) => ({
          id: author['@id'],
          name: author['values']['name']
        }))

        return {
          data: formattedData,
          totalItems
        }
      },
    }),
  }),
})

export const {
  useFetchAuthorsQuery
} = authorApi
