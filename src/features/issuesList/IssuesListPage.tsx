import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { fetchIssuesCount } from 'features/repoSearch/repoDetailsSlice'
import { RootState } from 'app/rootReducer'

import { IssuesPageHeader } from './IssuesPageHeader'
import { IssuesList } from './IssuesList'
import { IssuePagination, OnPageChangeCallback } from './IssuePagination'
import { fetchIssues } from './issuesSlice'

interface ILProps {
  org: string
  repo: string
  page: number
  setJumpToPage: (page: number) => void
  showIssueComments: (issueId: number) => void
}

export const IssuesListPage = ({
  org,
  repo,
  page = 1,
  setJumpToPage,
  showIssueComments
}: ILProps) => {
  const dispatch = useDispatch()

  const {
    currentPageIssues,
    isLoading,
    error: issuesError,
    issuesByNumber,
    pageCount
  } = useSelector((state: RootState) => state.issues)

  const openIssueCount = useSelector(
    (state: RootState) => state.repoDetails.openIssuesCount
  )

  const issues = currentPageIssues.map(
    issueNumber => issuesByNumber[issueNumber]
  )

  useEffect(() => {
    dispatch(fetchIssues(org, repo, page))
    dispatch(fetchIssuesCount(org, repo))
  }, [org, repo, page, dispatch])

  if (issuesError) {
    return (
      <div>
        <h1>Something went wrong...</h1>
        <div>{issuesError.toString()}</div>
      </div>
    )
  }

  const currentPage = Math.min(pageCount, Math.max(page, 1)) - 1

  let renderedList = isLoading ? (
    <h3>Loading...</h3>
  ) : (
    <IssuesList issues={issues} showIssueComments={showIssueComments} />
  )

  const onPageChanged: OnPageChangeCallback = selectedItem => {
    const newPage = selectedItem.selected + 1
    setJumpToPage(newPage)
  }

  return (
    <div id="issue-list-page">
      <IssuesPageHeader
        openIssuesCount={openIssueCount}
        org={org}
        repo={repo}
      />
      {renderedList}
      <IssuePagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={onPageChanged}
      />
    </div>
  )
}
