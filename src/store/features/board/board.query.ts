import { createApi } from '@reduxjs/toolkit/query/react'

import { BoardPage, RawBoardMember, IBoardMember } from '../../../types/board'
import { boardTypes } from '../../../utils/types'
import { AvailableLanguage } from '../../../utils/i18n'
import { createBaseQueryWithJsonAccept } from '../../utils'

export const boardApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'board',
  tagTypes: ['Board'],
  endpoints: (build) => ({
    fetchBoardPages: build.query<BoardPage[], string>({
      query: (rvcode: string) => `pages?pagination=false&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue) {
        return (baseQueryReturnValue as BoardPage[]).filter((page) => boardTypes.includes(page.page_code))
      },
    }),
    fetchBoardMembers: build.query<IBoardMember[], string>({
      query: (rvcode: string) => `journals/boards/${rvcode}`,
      transformResponse(baseQueryReturnValue: { boards: RawBoardMember[] }) {
        const formattedBoardMembers = (baseQueryReturnValue.boards).map((board) => {
          const roles = board.roles.length > 0 ? board.roles[0].map(role => role.replace(/_/g, '-')) : []

          return {
            ...board,
            biography: board.additionalProfileInformation?.biography,
            roles,
            rolesLabels: roles.filter(role => !boardTypes.includes(role)),
            affiliations: board.additionalProfileInformation?.affiliations ?? [],
            assignedSections: board.assignedSections ? board.assignedSections.map((assignedSection: { sid: number, titles: Record<AvailableLanguage, string> }) => ({
              ...assignedSection,
              title: assignedSection.titles
            })): [],
            socialMedias: board.additionalProfileInformation?.socialMedias,
            websites: board.additionalProfileInformation?.webSites ?? []
          }
        })
        
        return formattedBoardMembers;
      },
    }),
  }),
})

export const {
  useFetchBoardPagesQuery,
  useFetchBoardMembersQuery
} = boardApi
