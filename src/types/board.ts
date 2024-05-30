import { IPage } from "./page";

export type IBoardPage = IPage;

export interface IBoardMember {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  description: string;
  roles: string[];
  university: string;
  skills: string;
  picture?: string;
  socialNetworks: string[];
  website: string;
}