import { createSlice } from '@reduxjs/toolkit'

import { volumeApi } from './volume.query'
import { IVolumeState } from './volume.type'

const volumeSlice = createSlice({
  name: 'volume',
  initialState: {
    volumes: []
  } as IVolumeState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      volumeApi.endpoints.fetchVolumes.matchFulfilled,
      (state, { payload }) => {
        state.volumes = payload
      },
    )
  }
})

export default volumeSlice.reducer
