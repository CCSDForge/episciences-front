# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Mathematics Subject Classification 2020 section on article detail page, displaying MSC2020 codes as clickable links to zbmath.org
- WhatsApp and Bluesky sharing buttons in article details sidebar
- Sign-in link in the preheader bar next to the language switcher, with user icon on mobile and accessible new-window indication
- Cache busting for translation files to ensure updates are visible immediately
- Add Bluesky social network support for board members
- add ROR logo link for affiliations with rorId
- 2 New pages in About Menu (Indexation + Acknowledgements)
- Deployment scripts see [README.md](deploy/README.md])
- Preview for Zenodo PDF
- Accessibility Declaration FR + EN
- Footer link to Management/back office
- Config for CodeQL
- Config for Dependabot
- Status page link in footer
- feat: add new pages for About, Boards, and Publish
- feat(#94): update editor labels for Scientific and Editorial boards, and display all member roles
- Transform for author - ethical charter into an independent page
- Add a left sidebar (summary) to the Acknowledgements page, the Ethical Charter page, the ForReviewers page, and the ForConferenceOrganisers page.
- Added a 404 error page
- feat(#55): ensure Download All button always appears last using flexbox order
- Empty state message for volumes without articles (EN: "This volume does not yet contain any documents." / FR: "Ce volume ne contient pas encore de documents.")
- Journal code validation to prevent cross-journal article access - articles now redirect to 404 if they don't belong to the current journal
- Add volume and section access validation by journal (rvid) to prevent cross-journal access with customized notFound(404) messages
- Display copyeditor and webmaster members in Technical Board section with role labels
- Spanish (es) translation file and language support
- Content fallback utility (`getLocalizedContent`) for presentation pages: falls back to default language when content is unavailable, with a translated "content not available" message
- Cache `getLocalizedContent` and `getEdito` results in local variables to avoid redundant calls during render

### Fixed

- Fix license comparison in article sidebar by normalizing trailing slashes in URLs
- Handle array-shaped `license_ref` in article metadata (pick the `vor` entry or first element)
- Fix collapsible sections on presentation pages hiding subtitles when collapsed — only hide direct children except the subtitle
- Fix preheader bar height inconsistency on resize and vertically center its content
- Fix page content hidden behind fixed header on mobile by correcting main margin-top values
- Fix empty section rendered on the for-authors page when the page title is empty
- Fix for-authors sidebar missing the first H2 heading and its H3 children
- Display all affiliations for board members instead of only the first one (#73)
- Breadcrumbs: use correct paths from config and fix navigation
- Volume page, display other volumes with a link
- Fixed truncated Markdown not rendered in /HomeSections/PresentationSection

### Changed

- Consolidate journal logos into a single SVG file per journal by removing size-specific suffixes and managing dimensions via CSS to prevent layout shift
- Filter and sort member cards on the homepage: display only Editorial and Scientific Advisory boards, with Chief Editors prioritized and alphabetical sorting by name (#89)
- Underline URLs in news content on the /news page
- Increase homepage news snippet character limit from 200 to 350
- Sort social sharing buttons alphabetically in article details sidebar
- Sort editorial board members by role : Editors-in-chief first, then editors
- Do not display empty sections (abstracts, keywords, relationships)
- Refactored language switcher for better UI/UX and A11y

### Security

- Fix URL sanitization vulnerability in board member social links

<!--

### Deprecated
### Removed
### Security
-->
