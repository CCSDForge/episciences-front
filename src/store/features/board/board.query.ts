import { createApi } from '@reduxjs/toolkit/query/react'

import { IBoardPage, IBoardMember } from '../../../types/board'
import { createBaseQueryWithJsonAccept } from '../../utils'
import { boardTypes } from '../../../utils/filter'

export const boardApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'board',
  tagTypes: ['Board'],
  endpoints: (build) => ({
    fetchBoardPages: build.query<IBoardPage[], string>({
      query: (rvcode: string) => `pages?pagination=false&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue) {
        return (baseQueryReturnValue as IBoardPage[]).filter((page) => boardTypes.includes(page.page_code))
      },
    }),
    fetchBoardMembers: build.query<IBoardMember[], string>({
      query: (rvcode: string) => `journals/boards/${rvcode}`,
      transformResponse(baseQueryReturnValue: { boards: { roles: string[][] }[] }) {
        const formattedBoardMembers = baseQueryReturnValue.boards.map((board) => ({
          ...board,
          roles: board.roles[0].map(role => role.replace('_', '-'))
        }))
        
        return formattedBoardMembers as unknown as IBoardMember[];
      },
    }),
  }),
})

export const {
  useFetchBoardPagesQuery,
  useFetchBoardMembersQuery
} = boardApi
