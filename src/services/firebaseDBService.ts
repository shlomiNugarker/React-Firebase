import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  setDoc,
  onSnapshot,
  DocumentData,
  deleteDoc,
} from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

export const firebaseDBService = {
  initFirebase,
  getDocuments,
  getDocument,
  addDocument,
  saveDocument,
  subscribe,
  updateDocument,
  deleteDocument,
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

  const app = initializeApp(firebaseConfig)
  return app
}

async function updateDocument(
  collectionName: string,
  id: string,
  document: DocumentData
) {
  const db = getFirestore()
  try {
    const docRef = doc(db, collectionName, id)
    return await updateDoc(docRef, document)
  } catch (error) {
    console.log(error)
  }
}
async function deleteDocument(collectionName: string, id: string) {
  const db = getFirestore()
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.log(error)
  }
}

async function addDocument(collectionName: string, document: DocumentData) {
  const db = getFirestore()
  try {
    const docRef = await addDoc(collection(db, collectionName), document)
    return docRef
  } catch (err) {
    console.error('Error adding document: ', err)
    throw err
  }
}

async function getDocument(collectionName: string, id: string) {
  const db = getFirestore()
  const snap = await getDoc(doc(db, collectionName, id))
  if (!snap.exists()) {
    return null
  }
  const docToReturn = snap.data()
  docToReturn.id = id
  return docToReturn
}

async function saveDocument(collectionName: string, document: any, id: string) {
  const db = getFirestore()
  await setDoc(doc(db, collectionName, id), document, { merge: true })
}

async function getDocuments(collectionName: string, filterBy = {}) {
  const db = getFirestore()
  var collectionRef = collection(db, collectionName)
  const querySnapshot = await getDocs(collectionRef)
  const docs: DocumentData[] = []
  querySnapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() })
  })
  return docs
}

function subscribe(collectionName: string, cb: Function) {
  const db = getFirestore()
  const docs: { id: string }[] = []
  const unsub = onSnapshot(collection(db, collectionName), (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() })
    })
    cb(docs)
  })
}
