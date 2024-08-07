import { useEffect } from "react";

import { useFetchJournalQuery } from "../store/features/journal/journal.query";
import { setCurrentJournal } from "../store/features/journal/journal.slice";
import { useAppDispatch, useAppSelector } from "./store";

function JournalHook (): null {
  const journalRvCode = import.meta.env.VITE_JOURNAL_RVCODE;

  const dispatch = useAppDispatch();
  const currentJournal = useAppSelector(state => state.journalReducer.currentJournal);
  const { data: fetchedJournal } = useFetchJournalQuery(journalRvCode);

  useEffect(() => {
    if (fetchedJournal && !currentJournal) {
      dispatch(setCurrentJournal(fetchedJournal));
    }
  }, [dispatch, fetchedJournal, currentJournal, journalRvCode]);

  return null;
}

export default JournalHook;