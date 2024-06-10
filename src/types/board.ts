import { AvailableLanguage } from "../utils/i18n";
import { IPage } from "./page";

export type BoardPage = IPage;

export interface IBoardMemberAffiliation {
  label: string;
  rorId: string;
}

export interface IBoardMemberAssignedSection {
  sid: number;
  title: Record<AvailableLanguage, string>;
}

export interface IBoardMember {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  biography?: string;
  roles: string[];
  affiliations: IBoardMemberAffiliation[];
  assignedSections: IBoardMemberAssignedSection[];
  twitter?: string;
  mastodon?: string;
  website?: string;
  orcid?: string;
  picture?: string;
}

export type RawBoardMember = IBoardMember & {
  roles: string[][];
  assignedSections?: {
    sid: number;
    titles: Record<AvailableLanguage, string>
  }[];
  additionalProfileInformation?: {
    biography?: string;
    affiliations: IBoardMemberAffiliation[];
    socialMedias?: string;
    webSites: string[];
  }
}