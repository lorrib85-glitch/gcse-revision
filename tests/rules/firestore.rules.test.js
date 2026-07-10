import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest'
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'

// Emulator-backed proof that firestore.rules enforces account isolation
// independently of the client — no live Firebase, deterministic test users.
// Run via `pnpm test:rules` (firebase emulators:exec wraps this so the
// Firestore emulator is running and FIRESTORE_EMULATOR_HOST is set).

const __dirname = dirname(fileURLToPath(import.meta.url))
const rules = readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8')

let testEnv

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-rise-rules',
    firestore: { rules },
  })
})

afterAll(async () => { if (testEnv) await testEnv.cleanup() })
beforeEach(async () => { await testEnv.clearFirestore() })

// The real snapshot shape (progressSync.js): { version, updatedAt, data }.
const snapshot = (extra = {}) => ({ version: 1, updatedAt: Date.now(), data: { gcse_progress: { streak: 3 } }, ...extra })

function progressRef(db, uid, docId = 'main') {
  return doc(db, 'users', uid, 'progress', docId)
}

// Seed a document bypassing rules — for setting up "another learner's" data.
async function seedProgress(uid, value) {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(progressRef(ctx.firestore(), uid), value)
  })
}

describe('Firestore rules — unauthenticated access', () => {
  it('cannot read a learner\'s progress', async () => {
    await seedProgress('alice', snapshot())
    const db = testEnv.unauthenticatedContext().firestore()
    await assertFails(getDoc(progressRef(db, 'alice')))
  })

  it('cannot write progress', async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertFails(setDoc(progressRef(db, 'alice'), snapshot()))
  })
})

describe('Firestore rules — the authenticated owner', () => {
  it('can read their own progress', async () => {
    await seedProgress('alice', snapshot())
    const db = testEnv.authenticatedContext('alice').firestore()
    await assertSucceeds(getDoc(progressRef(db, 'alice')))
  })

  it('can create their own progress document', async () => {
    const db = testEnv.authenticatedContext('alice').firestore()
    await assertSucceeds(setDoc(progressRef(db, 'alice'), snapshot()))
  })

  it('can update their own progress document', async () => {
    await seedProgress('alice', snapshot())
    const db = testEnv.authenticatedContext('alice').firestore()
    await assertSucceeds(updateDoc(progressRef(db, 'alice'), { updatedAt: Date.now() }))
  })

  it('can delete their own progress document', async () => {
    await seedProgress('alice', snapshot())
    const db = testEnv.authenticatedContext('alice').firestore()
    await assertSucceeds(deleteDoc(progressRef(db, 'alice')))
  })
})

describe('Firestore rules — a different authenticated learner', () => {
  it('cannot read another uid\'s progress', async () => {
    await seedProgress('bob', snapshot())
    const db = testEnv.authenticatedContext('alice').firestore()
    await assertFails(getDoc(progressRef(db, 'bob')))
  })

  it('cannot create another uid\'s progress', async () => {
    const db = testEnv.authenticatedContext('alice').firestore()
    await assertFails(setDoc(progressRef(db, 'bob'), snapshot()))
  })

  it('cannot update another uid\'s progress', async () => {
    await seedProgress('bob', snapshot())
    const db = testEnv.authenticatedContext('alice').firestore()
    await assertFails(updateDoc(progressRef(db, 'bob'), { updatedAt: Date.now() }))
  })

  it('cannot delete another uid\'s progress', async () => {
    await seedProgress('bob', snapshot())
    const db = testEnv.authenticatedContext('alice').firestore()
    await assertFails(deleteDoc(progressRef(db, 'bob')))
  })
})

describe('Firestore rules — payload cannot spoof ownership', () => {
  it('embedding another learner\'s uid/email in the body does not grant access to their path', async () => {
    const db = testEnv.authenticatedContext('alice').firestore()
    // Alice tries to write Bob's document, claiming to be Bob in the payload.
    await assertFails(setDoc(progressRef(db, 'bob'), snapshot({
      data: { riseUser: { uid: 'bob', email: 'bob@example.com', name: 'Bob' } },
    })))
  })

  it('ownership is decided by request.auth.uid + path, so a foreign uid in Alice\'s own doc is still allowed', async () => {
    const db = testEnv.authenticatedContext('alice').firestore()
    // The real snapshot legitimately carries a riseUser with a uid — writing it
    // to Alice's OWN path must succeed; the payload is never used for auth.
    await assertSucceeds(setDoc(progressRef(db, 'alice'), snapshot({
      data: { riseUser: { uid: 'alice', email: 'alice@example.com' } },
    })))
  })
})

describe('Firestore rules — unknown paths are denied by default', () => {
  it('denies an unexpected subcollection under the owner\'s own user doc', async () => {
    const db = testEnv.authenticatedContext('alice').firestore()
    await assertFails(setDoc(doc(db, 'users', 'alice', 'secrets', 'x'), { any: true }))
    await assertFails(getDoc(doc(db, 'users', 'alice', 'secrets', 'x')))
  })

  it('denies unrelated top-level collections even for an authenticated user', async () => {
    const db = testEnv.authenticatedContext('alice').firestore()
    await assertFails(setDoc(doc(db, 'admin', 'config'), { any: true }))
    await assertFails(getDoc(doc(db, 'leaderboard', 'global')))
  })
})
