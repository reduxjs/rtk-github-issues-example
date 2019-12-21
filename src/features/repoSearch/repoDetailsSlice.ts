import { declareAction, declareAtom, map, combine } from '@reatom/core'

import { RepoDetails, getRepoDetails } from 'api/githubAPI'

interface RepoDetailsState {
  openIssuesCount: number
  error: string | null
}

const initialState: RepoDetailsState = {
  openIssuesCount: -1,
  error: null
}

export const getRepoDetailsSuccess = declareAction<RepoDetails>()
export const getRepoDetailsFailed = declareAction<string>()
const repoDetailsAtom = declareAtom(initialState, on => [
  on(getRepoDetailsSuccess, (state, payload) => ({
    ...state,
    openIssuesCount: payload.open_issues_count,
    error: null
  })),
  on(getRepoDetailsFailed, (state, payload) => ({
    ...state,
    openIssuesCount: -1,
    error: payload
  }))
])

export const openIssuesCountAtom = map(
  repoDetailsAtom,
  repoDetails => repoDetails.openIssuesCount
)

export default combine({ repoDetailsAtom, openIssuesCountAtom })

export const fetchIssuesCount = declareAction<{ org: string; repo: string }>(
  async ({ org, repo }, { dispatch }) => {
    try {
      const repoDetails = await getRepoDetails(org, repo)
      dispatch(getRepoDetailsSuccess(repoDetails))
    } catch (err) {
      dispatch(getRepoDetailsFailed(err.toString()))
    }
  }
)
