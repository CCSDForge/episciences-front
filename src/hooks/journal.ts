import { useEffect } from "react";
import { useFetchJournalQuery } from "../store/features/journal/journal.query";
import { setCurrentJournal } from "../store/features/journal/journal.slice";
import { useAppDispatch, useAppSelector } from "./store";
import { getJournalRvCode } from "../lib/config";

function JournalHook(): null {
  const journalRvCode = getJournalRvCode();

  const dispatch = useAppDispatch();
  const currentJournal = useAppSelector(state => state.journalReducer.currentJournal);
  const { data: fetchedJournal } = useFetchJournalQuery(journalRvCode);

  useEffect(() => {
    if (fetchedJournal && !currentJournal) {
      dispatch(setCurrentJournal(fetchedJournal));
    }
  }, [dispatch, fetchedJournal, currentJournal, journalRvCode]);

  // Enhanced debug logging
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.debug('Journal RvCode Debug:', {
        rvcode: journalRvCode,
        hostname: window.location.hostname,
        isLocalhost: window.location.hostname === 'localhost',
        envValue: import.meta.env.VITE_JOURNAL_RVCODE
      });
    }
  }, [journalRvCode]);

  return null;
}

export default JournalHook;