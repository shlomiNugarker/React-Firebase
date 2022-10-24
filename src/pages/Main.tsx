import { DocumentData } from 'firebase/firestore'
import { useRef, RefObject, useState } from 'react'
import { firebaseDBService } from '../services/firebaseDBService'

export const Main = () => {
  const [robots, setRobots] = useState<DocumentData[] | null>(null)
  const inputRef: RefObject<HTMLInputElement> = useRef(null)

  function onAddRobot() {
    let name = inputRef.current?.value
    if (name) {
      firebaseDBService.addDocument('robots', { name })
    }
  }

  const onGetDocs = async () => {
    const docs = await firebaseDBService.getDocuments('robots')
    setRobots(docs)
    console.log(docs)
  }

  const onUpdateDoc = async () => {
    const documentToUpdate: DocumentData = {
      name: 'new-name',
    }
    const updatedDoc = await firebaseDBService.updateDocument(
      'robots',
      'BQGE7kt4o4joiKT8Zq3Y',
      documentToUpdate
    )
    console.log(updatedDoc)
  }

  const onDeleteDoc = async (id: string) => {
    await firebaseDBService.deleteDocument('robots', id)
  }

  return (
    <div className="main-page">
      <input ref={inputRef} type="text" />
      <button onClick={onAddRobot}>Add Robot</button>
      <button onClick={onUpdateDoc}>onUpdateDoc</button>
      <button onClick={onGetDocs}>getDocs</button>
      {robots &&
        robots.map((robot) => (
          <div key={robot.id}>
            <p>{robot.name}</p>
            <img src={`https://robohash.org/${robot.id}`} alt="" />
            <button onClick={() => onDeleteDoc(robot.id)}>onDeleteDoc</button>
          </div>
        ))}
    </div>
  )
}
