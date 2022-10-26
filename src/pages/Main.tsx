import { async } from '@firebase/util'
import { User } from 'firebase/auth'
import { DocumentData } from 'firebase/firestore'
import { useRef, RefObject, useState, useEffect } from 'react'
import { firebaseAuthService } from '../services/firebaseAuthService'
import { firebaseDBService } from '../services/firebaseDBService'

export const Main = () => {
  const [robots, setRobots] = useState<DocumentData[] | null>(null)
  const inputRef: RefObject<HTMLInputElement> = useRef(null)

  function onAddRobot() {
    let name = inputRef.current?.value
    if (name) {
      firebaseDBService.addDocument('robots', { name })
      onGetDocs()
    }
  }

  const onGetDocs = async () => {
    const docs = await firebaseDBService.getDocuments('robots')
    setRobots(docs)
  }

  const onUpdateDoc = async (collectionName: string, id: string) => {
    const documentToUpdate: DocumentData = {
      name: 'new-name',
    }
    const updatedDoc = await firebaseDBService.updateDocument(
      collectionName,
      id,
      documentToUpdate
    )
    return updatedDoc
  }

  const onDeleteDoc = async (id: string) => {
    await firebaseDBService.deleteDocument('robots', id)
    onGetDocs()
  }

  const getRandomNumber = (maxNum: number) => {
    return Math.floor(Math.random() * maxNum)
  }

  const getRandomColor = () => {
    const h = getRandomNumber(360)
    const s = getRandomNumber(100)
    const l = getRandomNumber(100)
    return `hsl(${h}deg, ${s}%, ${l}%)`
  }

  useEffect(() => {
    onGetDocs()
  }, [])

  if (!robots)
    return (
      <div className="main-page">
        <p className="loading">Loading...</p>
      </div>
    )

  return (
    <div className="main-page">
      <div className="add-container">
        <input ref={inputRef} type="text" />
        <button onClick={onAddRobot}>Add Robot</button>
      </div>
      <div className="list">
        {robots &&
          robots.map((robot) => (
            <div key={robot.id}>
              <p>{robot.name}</p>
              <img
                src={`https://robohash.org/${robot.id}`}
                style={{ backgroundColor: getRandomColor() }}
                alt=""
              />
              <button onClick={() => onDeleteDoc(robot.id)}>Delete</button>
            </div>
          ))}
      </div>
    </div>
  )
}
