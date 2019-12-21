import { useSelector } from 'react-redux'
import { Middleware } from '@reduxjs/toolkit'
import { getState, Atom, Action, Store as ReatomStore } from '@reatom/core'

import { RootState } from 'app/rootReducer'

export function useAtom<T>(atom: Atom<T>): T {
  const atomState = useSelector((state: RootState) => {
    const atomState = getState(state.repoDetails, atom)
    return atomState
  })
  return atomState!
}

export const reactionsMiddleware: Middleware = store => next => (
  action: Action<any>
) => {
  const result = next(action)
  if (Array.isArray(action.reactions)) {
    action.reactions.forEach(cb =>
      cb(action.payload, (store as unknown) as ReatomStore)
    )
  }
  return result
}
