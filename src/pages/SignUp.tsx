import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { firebaseAuthService } from '../services/firebaseAuthService'

export const SignUp = (props: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const [userCred, setUserCred] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()

  const onSignUp = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    try {
      setIsLoading(true)
      const loggedUser = await firebaseAuthService.signUp(
        userCred.email,
        userCred.password
      )
      props.setLoggedInUser(loggedUser)
      navigate('/main')
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUpWithGoogle = async () => {
    try {
      setIsLoading(true)
      const loggedUser = await firebaseAuthService.signInWithGoogle()
      props.setLoggedInUser(loggedUser)
      navigate('/main')
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  const onSignInWithFacebook = async () => {
    try {
      setIsLoading(true)
      const loggedUser = await firebaseAuthService.signInWithFacebook()
      props.setLoggedInUser(loggedUser)
      navigate('/main')
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const field = ev.target.name
    const value = ev.target.value
    setUserCred((prevVal) => ({ ...prevVal, [field]: value }))
  }

  return (
    <section className="sign-up-page ">
      <div className="container">
        <div className="bg">
          <h1>Sign Up</h1>

          <form onSubmit={onSignUp}>
            <label htmlFor="address">
              <p>Email address</p>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={userCred.email}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="password">
              <p>Password</p>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={userCred.password}
                onChange={handleChange}
              />
            </label>
            <button>Sign up</button>
          </form>
          <div className="divider">
            <span>Or</span>
          </div>

          <button onClick={onSignUpWithGoogle}>Sign up with google</button>
          <button onClick={onSignInWithFacebook}>Sign in with Facebook</button>
          <span className="loading">{isLoading && <div>Loading...</div>}</span>
        </div>
      </div>
    </section>
  )
}
