import React from 'react'

interface OrgProps {
  org: string
  repo: string
}

type HeaderProps = {
  openIssuesCount: number
} & OrgProps

function OrgRepo({ org, repo }: OrgProps) {
  return (
    <span>
      <a href={`https://github.com/${org}`} className="header__org">
        {org}
      </a>
      {' / '}
      <a href={`https://github.com/${org}/${repo}`} className="header__repo">
        {repo}
      </a>
    </span>
  )
}

export function IssuesPageHeader({
  openIssuesCount = -1,
  org,
  repo
}: HeaderProps) {
  if (openIssuesCount === -1) {
    return (
      <h1>
        Open issues for <OrgRepo org={org} repo={repo} />
      </h1>
    )
  } else {
    const pluralizedIssue = openIssuesCount === 1 ? 'issue' : 'issues'
    return (
      <h1>
        <span className="header__openIssues">{openIssuesCount}</span> open{' '}
        {pluralizedIssue} for <OrgRepo org={org} repo={repo} />
      </h1>
    )
  }
}
