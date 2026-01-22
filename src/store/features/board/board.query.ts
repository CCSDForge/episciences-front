import { createApi } from '@reduxjs/toolkit/query/react';

import { BoardPage, RawBoardMember, IBoardMember } from '../../../types/board';
import { BOARD_TYPE, boardTypes, sortBoardMembers } from '../../../utils/board';
import { AvailableLanguage } from '../../../utils/i18n';
import { createBaseQueryWithJsonAccept } from '../../utils';

export const boardApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'board',
  tagTypes: ['Board'],
  endpoints: build => ({
    fetchBoardPages: build.query<BoardPage[], string>({
      query: (rvcode: string) => `pages?pagination=false&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue) {
        return (baseQueryReturnValue as BoardPage[]).filter(page =>
          boardTypes.includes(page.page_code as BOARD_TYPE)
        );
      },
    }),
    fetchBoardMembers: build.query<IBoardMember[], string>({
      query: (rvcode: string) =>
        `journals/boards/${rvcode}?page=1&itemsPerPage=100&pagination=false`,
      transformResponse(baseQueryReturnValue: RawBoardMember[]) {
        const formattedBoardMembers = baseQueryReturnValue.map(board => {
          const roles =
            board.roles.length > 0
              ? board.roles[0].map(role => role.replace(/_/g, '-'))
              : [];

          let twitter, mastodon, bluesky;
          if (board.additionalProfileInformation?.socialMedias) {
            const socialMedia = board.additionalProfileInformation.socialMedias;

            // Detect Bluesky: contains bsky.app or bsky.social
            if (
              socialMedia.includes('bsky.app') ||
              socialMedia.includes('bsky.social')
            ) {
              // If it's already a full URL, use it directly
              if (socialMedia.startsWith('http')) {
                bluesky = socialMedia;
              } else {
                // Handle format like @user.bsky.social or user.bsky.social
                const handle = socialMedia.replace(/^@/, '');
                bluesky = `https://bsky.app/profile/${handle}`;
              }
            }
            // Detect Mastodon: format @user@instance (two @ symbols)
            else if ((socialMedia.match(/@/g) || []).length > 1) {
              const parts = socialMedia.split('@');
              mastodon = `https://${parts[2]}/@${parts[1]}`;
            }
            // Detect Twitter/X: single @ or contains twitter.com/x.com
            else if (
              socialMedia.includes('twitter.com') ||
              socialMedia.includes('x.com')
            ) {
              twitter = socialMedia.startsWith('http')
                ? socialMedia
                : `https://${socialMedia}`;
            }
            // Default: assume Twitter/X handle with single @
            else if (socialMedia.startsWith('@')) {
              twitter = `${import.meta.env.VITE_TWITTER_HOMEPAGE}/${socialMedia.slice(1)}`;
            }
          }

          return {
            ...board,
            biography: board.additionalProfileInformation?.biography,
            roles,
            affiliations:
              board.additionalProfileInformation?.affiliations ?? [],
            assignedSections: board.assignedSections
              ? board.assignedSections.map(
                  (assignedSection: {
                    sid: number;
                    titles: Record<AvailableLanguage, string>;
                  }) => ({
                    ...assignedSection,
                    title: assignedSection.titles,
                  })
                )
              : [],
            twitter,
            mastodon,
            bluesky,
            website: board.additionalProfileInformation?.webSites
              ? board.additionalProfileInformation.webSites[0]
              : undefined,
          };
        });

        // Sort members by role (chief-editor, editor), then by lastname, then by firstname
        return sortBoardMembers(formattedBoardMembers);
      },
    }),
  }),
});

export const { useFetchBoardPagesQuery, useFetchBoardMembersQuery } = boardApi;
