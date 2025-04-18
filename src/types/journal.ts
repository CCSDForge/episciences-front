interface IJournalSettings {
  setting: string;
  value: string;
}

export interface IJournal {
  id: number;
  code: string;
  name: string;
  settings: IJournalSettings[];
}

export type RawJournal = IJournal & {
  rvid: number;
}