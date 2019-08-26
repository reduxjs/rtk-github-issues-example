import { createSlice, PayloadAction } from 'redux-starter-kit'

import { AppThunk } from 'app/store'

import { RepoDetails, getRepoDetails } from 'api/githubAPI'

interface RepoDetailsState {
  openIssuesCount: number
  error: string | null
}

const initialState: RepoDetailsState = {
  openIssuesCount: -1,
  error: null
}

const repoDetails = createSlice({
  slice: 'repoDetails',
  initialState,
  reducers: {
    getRepoDetailsSuccess(state, action: PayloadAction<RepoDetails>) {
      state.openIssuesCount = action.payload.open_issues_count
      state.error = null
    },
    getRepoDetailsFailed(state, action: PayloadAction<string>) {
      state.openIssuesCount = -1
      state.error = action.payload
    }
  }
})

export const {
  getRepoDetailsSuccess,
  getRepoDetailsFailed
} = repoDetails.actions

export default repoDetails.reducer

export const fetchIssuesCount: AppThunk = (
  org: string,
  repo: string
) => async dispatch => {
  try {
    const repoDetails = await getRepoDetails(org, repo)
    dispatch(getRepoDetailsSuccess(repoDetails))
  } catch (err) {
    dispatch(getRepoDetailsFailed(err.toString()))
  }
}
