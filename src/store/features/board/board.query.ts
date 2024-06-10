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

          let twitter, mastodon;
          if (board.additionalProfileInformation?.socialMedias) {
            console.log(board.additionalProfileInformation.socialMedias)
            const atCount = (board.additionalProfileInformation?.socialMedias.match(/@/g) || []).length;
            
            if (atCount === 1) {
              twitter = `${import.meta.env.VITE_TWITTER_HOMEPAGE}/${board.additionalProfileInformation?.socialMedias.slice(1)}`;
            }
            else if (atCount > 1) {
              const parts = board.additionalProfileInformation?.socialMedias.split('@');
              mastodon = `https://${parts[2]}/@${parts[1]}`;
            }
          }

          return {
            ...board,
            biography: board.additionalProfileInformation?.biography,
            roles,
            affiliations: board.additionalProfileInformation?.affiliations ?? [],
            assignedSections: board.assignedSections ? board.assignedSections.map((assignedSection: { sid: number, titles: Record<AvailableLanguage, string> }) => ({
              ...assignedSection,
              title: assignedSection.titles
            })): [],
            twitter,
            mastodon,
            website: board.additionalProfileInformation?.webSites ? board.additionalProfileInformation.webSites[0] : undefined
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
