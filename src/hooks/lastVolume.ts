import { useEffect } from "react";

import { useFetchVolumesQuery } from "../store/features/volume/volume.query";
import { setLastVolume } from "../store/features/volume/volume.slice";
import { useAppDispatch, useAppSelector } from "./store";

function LastVolumeHook (): null {
  const dispatch = useAppDispatch();
  const currentJournal = useAppSelector(state => state.journalReducer.currentJournal);
  const lastVolume = useAppSelector(state => state.volumeReducer.lastVolume);

  const { data: volumes } = useFetchVolumesQuery({ rvid: currentJournal?.id!, page: 1, itemsPerPage: 1 }, { skip: !currentJournal?.id });

  useEffect(() => {
    if (volumes && volumes.data.length > 0 && currentJournal && !lastVolume) {
      const foundVolume = volumes.data[0];
      dispatch(setLastVolume(foundVolume));
    }
  }, [dispatch, volumes, currentJournal, lastVolume]);

  return null;
}

export default LastVolumeHook;