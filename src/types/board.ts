import { AvailableLanguage } from "../utils/i18n";
import { IPage } from "./page";

export type IBoardPage = IPage;

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
  rolesLabels: string[];
  affiliations: IBoardMemberAffiliation[];
  assignedSections: IBoardMemberAssignedSection[];
  socialMedias?: string;
  websites: string[];
  orcid?: string;
  picture?: string;
}