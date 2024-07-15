import { createApi } from '@reduxjs/toolkit/query/react'

import { IPartialArticle, RawArticle } from '../../../types/article'
import { FetchedArticle, formatArticle } from '../../../utils/article'
import { PaginatedResponseWithRange, Range } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const articleApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'article',
  tagTypes: ['Article'],
  endpoints: (build) => ({
    fetchArticles: build.query<{ data: FetchedArticle[], totalItems: number, range?: Range }, { rvcode: string, page: number, itemsPerPage: number, types?: string[], years?: number[], onlyAccepted?: boolean }>({
      query: ({ rvcode, page, itemsPerPage, types, years, onlyAccepted }) => {
        const baseUrl = `papers?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}`;
        let queryParams = '';

        if (onlyAccepted) {
          queryParams += `&only_accepted=true`;
        }

        if (types && types.length > 0) {
          const typesQuery = types.map(type => `type[]=${type}`).join('&')
          queryParams += `&${typesQuery}`;
        }
        
        if (years && years.length > 0) {
          const yearsQuery = years.map(year => `year[]=${year}`).join('&')
          queryParams += `&${yearsQuery}`;
        }
        
        return `${baseUrl}${queryParams}`;
      },
      transformResponse: (baseQueryReturnValue: PaginatedResponseWithRange<IPartialArticle>) => {
        const range = (baseQueryReturnValue['hydra:range'] as { publicationYears: number[] });

        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = baseQueryReturnValue['hydra:member'].map(partialArticle => ({
          id: partialArticle.paperid,
          ...partialArticle
        }));

        return {
          data: formattedData,
          totalItems,
          range: {
            ...range,
            years: range.publicationYears
          }
        }
      },
      onQueryStarted: async ({ rvcode, page, itemsPerPage, types, years, onlyAccepted }, { queryFulfilled, dispatch }) => {
        const { data: articles } = await queryFulfilled;
        const fullArticles: FetchedArticle[] = await Promise.all(
          articles.data.map(async (article: FetchedArticle) => {
            const rawArticle: RawArticle = await (await fetch(`${import.meta.env.VITE_API_ROOT_ENDPOINT}/papers/${article?.id}`)).json();
            return formatArticle(rawArticle);
          })
        );

        dispatch(articleApi.util.updateQueryData('fetchArticles', { rvcode, page, itemsPerPage, types, years, onlyAccepted }, (draftedData) => {
          Object.assign(draftedData.data, fullArticles)
        }));
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
