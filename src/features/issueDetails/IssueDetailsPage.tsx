import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import classnames from 'classnames'

import { insertMentionLinks } from 'utils/stringUtils'
import { getIssue, getComments, Issue, Comment } from 'api/githubAPI'
import { IssueLabels } from 'components/IssueLabels'

import { IssueMeta } from './IssueMeta'
import { IssueComments } from './IssueComments'

import styles from './IssueDetailsPage.module.css'
import './IssueDetailsPage.css'

interface IDProps {
  org: string
  repo: string
  issueId: number
  showIssuesList: () => void
}

export const IssueDetailsPage = ({
  org,
  repo,
  issueId,
  showIssuesList
}: IDProps) => {
  const [issue, setIssue] = useState<Issue | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsError, setCommentsError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchIssue() {
      try {
        setCommentsError(null)
        const issue = await getIssue(org, repo, issueId)
        setIssue(issue)
      } catch (err) {
        setCommentsError(err)
      }
    }

    fetchIssue()
  }, [org, repo, issueId])

  useEffect(() => {
    async function fetchComments() {
      if (issue !== null) {
        const comments = await getComments(issue.comments_url)
        setComments(comments)
      }
    }

    fetchComments()
  }, [issue])

  let content

  const backToIssueListButton = (
    <button className="pure-button" onClick={showIssuesList}>
      Back to Issues List
    </button>
  )

  if (commentsError) {
    return (
      <div className="issue-detail--error">
        {backToIssueListButton}
        <h1>There was a problem loading issue #{issueId}</h1>
        <p>{commentsError.toString()}</p>
      </div>
    )
  }

  if (issue === null) {
    content = (
      <div className="issue-detail--loading">
        {backToIssueListButton}
        <p>Loading issue #{issueId}...</p>
      </div>
    )
  } else {
    let renderedComments = <IssueComments issue={issue} comments={comments} />

    content = (
      <div className={classnames('issueDetailsPage', styles.issueDetailsPage)}>
        <h1 className="issue-detail__title">{issue.title}</h1>
        {backToIssueListButton}
        <IssueMeta issue={issue} />
        <IssueLabels labels={issue.labels} className={styles.issueLabels} />
        <hr className={styles.divider} />
        <div className={styles.summary}>
          <ReactMarkdown
            className={'testing'}
            source={insertMentionLinks(issue.body)}
          />
        </div>
        <hr className={styles.divider} />
        <ul>{renderedComments}</ul>
      </div>
    )
  }

  return <div>{content}</div>
}
