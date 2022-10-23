import { useRef, RefObject, useEffect } from 'react'
import { firebaseService } from '../services/firebase.service'

export const Main = () => {
  const inputRef: RefObject<HTMLInputElement> = useRef(null)

  function addUser() {
    let userName = inputRef.current?.value
    if (userName) {
      firebaseService.addDocument('users', { userName, isOn: false })
    }
  }

  const getDocs = async (collectionName: string) => {
    const docs = await firebaseService.getDocuments(collectionName)
    console.log(docs)
  }

  return (
    <div className="main-page">
      <input ref={inputRef} type="text" className="user-name" />
      <button onClick={addUser}>Add User</button>
      <ul className="user-list"></ul>
    </div>
  )
}
