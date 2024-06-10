import { createApi } from '@reduxjs/toolkit/query/react'

import { IPartialArticle, RawArticle } from '../../../types/article'
import { FetchedArticle, formatArticle } from '../../../utils/article'
import { PaginatedResponse } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const articleApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'article',
  tagTypes: ['Article'],
  endpoints: (build) => ({
    fetchArticles: build.query<{ data: FetchedArticle[], totalItems: number }, { rvcode: string, page: number, itemsPerPage: number, type?: string, section?: string, year?: number }>({
      query: ({ rvcode, page, itemsPerPage, type, section, year }) => {
        const baseUrl = `papers?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}`;
        let queryParams = '';

        if (type) queryParams += `&type=${type}`;
        
        if (section) queryParams += `&section=${section}`;
        
        if (year) queryParams += `&year=${year}`;
        
        return `${baseUrl}${queryParams}`;
      },
      transformResponse: (baseQueryReturnValue: PaginatedResponse<IPartialArticle>) => {
        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = baseQueryReturnValue['hydra:member'].map(partialArticle => ({
          id: partialArticle.paperid,
          ...partialArticle
        }));

        return {
          data: formattedData,
          totalItems
        }
      },
      onQueryStarted: async ({ rvcode, page, itemsPerPage, type, section, year }, { queryFulfilled, dispatch }) => {
        const { data: articles } = await queryFulfilled;
        const fullArticles = await Promise.all(
          articles.data.map(async (article: FetchedArticle) => {
            const rawArticle: RawArticle = await (await fetch(`${import.meta.env.VITE_API_ROOT_ENDPOINT}/papers/${article?.id}`)).json();
            return formatArticle(rawArticle);
          })
        );
        dispatch(articleApi.util.updateQueryData('fetchArticles', { rvcode, page, itemsPerPage, type, section, year }, _ => fullArticles));
      },
    }),
    fetchArticle: build.query<FetchedArticle, { paperid: string }>({
      query: ({ paperid } :{ paperid: string; }) => `papers/${paperid}`,
      transformResponse(baseQueryReturnValue: RawArticle) {
        return formatArticle(baseQueryReturnValue);
      }
    }),
  }),
})

export const {
  useFetchArticlesQuery,
  useFetchArticleQuery,
} = articleApi
