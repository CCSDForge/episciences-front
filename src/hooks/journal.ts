import { useEffect } from "react";

import { useFetchJournalsQuery } from "../store/features/journal/journal.query";
import { setCurrentJournal } from "../store/features/journal/journal.slice";
import { useAppDispatch, useAppSelector } from "./store";

function JournalHook (): null {
  const dispatch = useAppDispatch();
  const currentJournal = useAppSelector(state => state.journalReducer.currentJournal);
  const { data: journals } = useFetchJournalsQuery(null);

  const journalRvCode = import.meta.env.VITE_JOURNAL_RVCODE;

  useEffect(() => {
    if (journals && journals?.length > 0 && !currentJournal) {
      const foundJournal = journals.find(journal => journal.code === journalRvCode);

      if (foundJournal) {
        dispatch(setCurrentJournal(foundJournal));
      }
    }
  }, [dispatch, journals, currentJournal, journalRvCode]);

  return null;
}

export default JournalHook;