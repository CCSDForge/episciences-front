interface IJournalSettings {
  setting: string;
  value: string;
}

export interface IJournal {
  id: number;
  rvid: number;
  code: string;
  name: string;
  subtitle: string;
  settings: IJournalSettings[];
}

export type RawJournal = IJournal & {
  rvid: number;
};
