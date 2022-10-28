import { getAuth, RecaptchaVerifier } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { firebaseAuthService } from '../services/firebaseAuthService'

export const SignIn = (props: any) => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [userCred, setUserCred] = useState({
    email: '',
    password: '',
  })

  // SignIn with email & password
  const onSignIn = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    try {
      setIsLoading(true)
      const loggedUser = await firebaseAuthService.signIn(
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
  // SignIn With Phone Number:
  useEffect(() => {
    const auth = getAuth()
    window.recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button-id',
      {
        size: 'invisible',
        callback: (response: any) => {
          console.log({ response })

          OnSignInWithPhoneNumber()
        },
      },
      auth
    )
    // eslint-disable-next-line
  }, [])
  const OnSignInWithPhoneNumber = async () => {
    const auth = getAuth()
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {},
      auth
    )
    const phoneNumber: string | null = prompt('enter Phone number')
    // const phoneNumber = '+11234567890'
    if (!phoneNumber) {
      alert("Phone number doesn't exist")
      return
    }
    const confirmationResult = await firebaseAuthService.signInByPhoneNumber(
      phoneNumber
    )
    let code: string | null = null
    code = prompt('Enter code')
    // code = '123456'
    if (!code) return
    if (!confirmationResult) return

    const loggedUser = await firebaseAuthService.confirmSignInPhoneCode(
      confirmationResult,
      code
    )

    props.setLoggedInUser(loggedUser)
    navigate('/main')
  }
  // SignIn With Google:
  const onSignInWithGoogle = async () => {
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
  // SignIn With Github
  const onSignInWithGithub = async () => {
    try {
      setIsLoading(true)
      const loggedUser = await firebaseAuthService.signInWithGithub()
      props.setLoggedInUser(loggedUser)
      navigate('/main')
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  //  SignIn With Facebook
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
    <section className="sign-in-page ">
      <div className="container">
        <div className="bg">
          <h1>Sign In</h1>

          <form onSubmit={onSignIn}>
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
            <button>Login</button>
          </form>
          <div className="divider">
            <span>Or</span>
          </div>

          <div>
            <button id="sign-in-button-id" onClick={OnSignInWithPhoneNumber}>
              Sign in with phone number
            </button>

            <div id="recaptcha-container"></div>
          </div>

          <button onClick={onSignInWithGoogle}>Sign in with google</button>
          <button onClick={onSignInWithFacebook}>Sign in with Facebook</button>
          <button onClick={onSignInWithGithub}>Sign in with Github</button>

          <span className="loading">{isLoading && <div>Loading...</div>}</span>
        </div>
      </div>
    </section>
  )
}
