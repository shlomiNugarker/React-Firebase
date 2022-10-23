import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  getDoc,
  doc,
  setDoc,
  limit,
  startAfter,
  orderBy,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from 'firebase/auth'

export const firebaseService = {
  initFirebase,
  getDocuments,
  getDocument,
  addDocument,
  saveDocument,
  subscribe,
  // Auth
  signUp,
  signIn,
  signOut,
  doSignOut,
  ResetPasswordByEmail,
  sendVerificationByEmail,
}

async function initFirebase() {
  const firebaseConfig = {
    apiKey: 'AIzaSyCPMpxizhUQ-zwgsZ_NpPYkuJIxV4Eu2s8',
    authDomain: 'my-first-proj-d18dd.firebaseapp.com',
    projectId: 'my-first-proj-d18dd',
    storageBucket: 'my-first-proj-d18dd.appspot.com',
    messagingSenderId: '800039790492',
    appId: '1:800039790492:web:000ce64586c7f5a3a70a59',
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
}

async function addDocument(collectionName, document) {
  const db = getFirestore()
  try {
    const docRef = await addDoc(collection(db, collectionName), document)
    // console.log("Doc saved. id: ", docRef.id)
    return docRef
  } catch (err) {
    console.error('Error adding document: ', err)
    throw err
  }
}

async function getDocument(collectionName, id) {
  const db = getFirestore()
  const snap = await getDoc(doc(db, collectionName, id))
  if (!snap.exists()) {
    return null
  }
  const docToReturn = snap.data()
  docToReturn.id = id
  return docToReturn
}

async function saveDocument(collectionName, document, id) {
  const db = getFirestore()
  // returns undefined
  await setDoc(doc(db, collectionName, id), document, { merge: true })
}

async function getDocuments(collectionName, filterBy = {}) {
  const db = getFirestore()
  var collectionRef = collection(db, collectionName)
  var orderByParams = []

  if (filterBy.byUserId) {
    collectionRef = query(
      collectionRef,
      where('byUser.id', '==', filterBy.byUserId)
    )
  }

  // collectionRef = query(collectionRef, limit(pageSize))
  // if (filterBy.pageNo && gLastDocForPaging) {
  //     collectionRef = query(collectionRef, startAfter(gLastDocForPaging))
  // }

  const querySnapshot = await getDocs(collectionRef)
  //   gLastDocForPaging = querySnapshot.docs[querySnapshot.docs.length - 1]
  const docs = []
  querySnapshot.forEach((doc) => {
    // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`)
    docs.push({ id: doc.id, ...doc.data() })
  })
  return docs
}

function subscribe(collectionName, cb) {
  const db = getFirestore()
  const docs = []
  const unsub = onSnapshot(collection(db, collectionName), (querySnapshot) => {
    // console.log("Current data: ", querySnapshot.docs);
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`)
      docs.push({ id: doc.id, ...doc.data() })
    })
    cb(docs)
  })
}

// Auth

async function signUp(email, password) {
  try {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user
    console.log('Signed in, user:', user)
    return user
  } catch (error) {
    const errorCode = error.code
    const errorMessage = error.message
    console.log({ errorCode, errorMessage })
  }
}

async function signIn(email, password) {
  try {
    const auth = getAuth()
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user
    console.log('Signed in, user:', user)
    return user
  } catch (error) {
    const errorCode = error.code
    const errorMessage = error.message
    console.log({ errorCode, errorMessage })
  }
}

async function doSignOut() {
  try {
    const auth = getAuth()
    await signOut(auth)
    console.log('Sign-out successful.')
  } catch (error) {
    console.log(error)
  }
}

async function ResetPasswordByEmail(email) {
  try {
    const auth = getAuth()
    await sendPasswordResetEmail(auth, email)
    console.log('Password reset email sent!')
  } catch (error) {
    const errorCode = error.code
    const errorMessage = error.message
    console.log({ errorCode, errorMessage })
  }
}

async function sendVerificationByEmail() {
  const auth = getAuth()
  await sendEmailVerification(auth.currentUser).then(() => {
    console.log('Email verification sent!')
  })
}
