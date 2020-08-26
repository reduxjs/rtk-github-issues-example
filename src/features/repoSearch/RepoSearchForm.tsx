import React, { useState, ChangeEvent, useEffect, useRef } from 'react'
import { Formik, Form, useField } from 'formik'
import styled from '@emotion/styled'
import * as Yup from 'yup'
import { RootState } from '../../app/rootReducer'
import { useSelector, useDispatch } from 'react-redux'
import { displayRepo, setCurrentPage } from 'app/issuesDisplaySlice'

import './pure-forms.css'
import './pure-buttons.css'

interface Props {
  org: string
  repo: string
  page: number
  setOrgAndRepo: (org: string, repo: string) => void
  setJumpToPage: (page: number) => void
}

type InputEvent = ChangeEvent<HTMLInputElement>
type ChangeHandler = (e: InputEvent) => void

interface FormInputProps {
  promptLabel: string
  name: string
  //value: number
}
const FormikInput = ({ promptLabel, ...props }: FormInputProps) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
  const [field, meta] = useField(props.name)
  return (
    <>
      <label htmlFor={props.name}>{promptLabel}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <StyledErrorMessage>{meta.error}</StyledErrorMessage>
      ) : null}
    </>
  )
}

const StyledErrorMessage = styled.div`
  font-size: 12px;
  color: var(--red-600);
  width: 400px;
  margin-top: 0.25rem;
  &:before {
    content: '❌ ';
    font-size: 10px;
  }
  @media (prefers-color-scheme: dark) {
    color: var(--red-300);
  }
`

export const RepoSearchForm = ({
  org,
  repo,
  page,
  setOrgAndRepo,
  setJumpToPage
}: Props) => {
  const setPageRef = useRef((pName, p) => console.log(pName, p))

  useEffect(() => {
    setPageRef.current('currentPage', page)
  }, [page])

  return (
    <>
      <Formik
        initialValues={{ currentPage: 1, orgName: org, repoName: repo }}
        validationSchema={Yup.object({
          currentPage: Yup.number()
            .min(1, 'Must be greater than 0.')
            .required('Required'),
          orgName: Yup.string().required(),
          repoName: Yup.string().required()
        })}
        onSubmit={(values, { setSubmitting }) => {
          setOrgAndRepo(values.orgName, values.repoName)
          setJumpToPage(values.currentPage)
          setSubmitting(false)
        }}
      >
        {({ setFieldValue }) => {
          setPageRef.current = setFieldValue
          return (
            <>
              <Form>
                <FormikInput
                  name="orgName"
                  promptLabel="Organization:"
                ></FormikInput>
                <FormikInput
                  name="repoName"
                  promptLabel="Repository:"
                ></FormikInput>
                <FormikInput
                  name="currentPage"
                  promptLabel="Page Index:"
                ></FormikInput>
                <button type="submit">Load</button>
              </Form>
            </>
          )
        }}
      </Formik>
    </>
  )
}

export const RepoSearchFormC = () => {
  const dispatch = useDispatch()
  const { org, repo, page } = useSelector(
    (state: RootState) => state.issuesDisplay
  )

  const setOrgAndRepo = (org: string, repo: string) => {
    dispatch(displayRepo({ org, repo }))
  }

  const setJumpToPage = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const props = { org, repo, page, setOrgAndRepo, setJumpToPage }
  return (
    <>
      <RepoSearchForm {...props}></RepoSearchForm>
    </>
  )
}
