import { IBoardPage, IBoardMember } from '../../../types/board';

export interface IBoardState {
  pages: IBoardPage[];
  members: IBoardMember[];
}