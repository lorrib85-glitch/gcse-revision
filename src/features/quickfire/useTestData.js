import { useContext } from 'react'
import { TestDataContext } from './testDataContextObject.js'

export function useTestData() {
  return useContext(TestDataContext)
}
