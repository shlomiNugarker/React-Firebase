import { Route, Link, Routes, useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'
import './assets/scss/global.scss'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { Main } from './pages/Main'
import { SignIn } from './pages/SignIn'
import { firebaseAuthService } from './services/firebaseAuthService'
import { firebaseDBService } from './services/firebaseDBService'
import { SignUp } from './pages/SignUp'
import { User } from 'firebase/auth'

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
  const [isAppInitialed, setIsAppInitialed] = useState(false)

  const navigate = useNavigate()
  const initFirebase = async () => {
    await firebaseDBService.initFirebase()
    setIsAppInitialed(true)
  }

  const onSignOut = async () => {
    console.log('onSignOut')
    firebaseAuthService.doSignOut()
    setLoggedInUser(null)
    navigate('/')
  }

  const getConnectedUser = () => {
    const user: User | null = firebaseAuthService.getLoggedInUser()
    setLoggedInUser(user)
  }

  useEffect(() => {
    initFirebase()
    getConnectedUser()
  }, [])

  if (!isAppInitialed) return <div> Loading firebase...</div>

  console.log('render App')
  console.log({ loggedInUser })

  return (
    <>
      <nav className="temp-nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {/* <li>
            <Link to="/about">About</Link>
          </li> */}
          {loggedInUser && (
            <li>
              <Link to="/main">Main</Link>
            </li>
          )}
          <li>
            <Link to="/sign-in">sign-in</Link>
          </li>
          <li>
            <Link to="/sign-up">sign-up</Link>
          </li>
        </ul>

        {loggedInUser && (
          <div>
            <p>Hello, {loggedInUser.displayName || loggedInUser.phoneNumber}</p>
            <button onClick={onSignOut}>Logout</button>
          </div>
        )}
      </nav>
      <Routes>
        <Route path="/main" element={<Main loggedInUser={loggedInUser} />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/sign-in"
          element={<SignIn setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="/sign-up"
          element={<SignUp setLoggedInUser={setLoggedInUser} />}
        />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
