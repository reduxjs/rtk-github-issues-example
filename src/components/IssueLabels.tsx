import React from 'react'
import classnames from 'classnames'

import { Label } from 'api/githubAPI'

interface IssueLabelsProps {
  labels: Label[]
  className?: string
}

export const IssueLabels = ({ labels, className }: IssueLabelsProps) => (
  <div className={classnames('issue__labels', className)}>
    {labels.map(label => (
      <span
        key={label.id}
        className="issue__label"
        style={{
          boxShadow: `0 0 2px #${label.color}`,
          borderColor: `#${label.color}`
        }}
      >
        {label.name}
      </span>
    ))}
  </div>
)
