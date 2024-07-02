import { createApi } from '@reduxjs/toolkit/query/react'

import { IFacetAuthor, IAuthor, IAuthorArticle, RawAuthorArticle } from '../../../types/author'
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
          name: author['values']['name'],
          count: author['values']['count']
        }))

        return {
          data: formattedData,
          totalItems
        }
      },
    }),
    fetchAuthorArticles: build.query<{ data: IAuthorArticle[], totalItems: number }, { rvcode: string, fullname: string; }>({
      query: ({ rvcode, fullname } :{ rvcode: string, fullname: string; }) => {
        const trimedFullname = fullname.replace(/\s/g, "")
        return `browse/authors-search/${trimedFullname}?pagination=false&code=${rvcode}`
      },
      transformResponse(baseQueryReturnValue: PaginatedResponse<RawAuthorArticle>) {
        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member']).map((article) => ({
          id: article['paperid'],
          title: article['paper_title_t'][0],
          publicationDate: article['publication_date_tdate'],
          doi: article['doi_s']
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
  useFetchAuthorsQuery,
  useFetchAuthorArticlesQuery
} = authorApi
