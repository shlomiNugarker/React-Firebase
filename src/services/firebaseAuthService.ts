import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from 'firebase/auth'

export const firebaseAuthService = {
  signUp,
  signIn,
  signOut,
  doSignOut,
  ResetPasswordByEmail,
  sendVerificationByEmail,
}

async function signUp(email: string, password: string) {
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
    if (error instanceof Error) console.log(error.message)
    else console.log(error)
  }
}

async function signIn(email: string, password: string) {
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
    if (error instanceof Error) console.log(error.message)
    else console.log(error)
  }
}

async function doSignOut() {
  try {
    const auth = getAuth()
    console.log({ auth })

    await signOut(auth)
    console.log('Sign-out successful.')
  } catch (error) {
    if (error instanceof Error) console.log(error.message)
    else console.log(error)
  }
}

async function ResetPasswordByEmail(email: string) {
  try {
    const auth = getAuth()
    await sendPasswordResetEmail(auth, email)
    console.log('Password reset email sent!')
  } catch (error) {
    if (error instanceof Error) console.log(error.message)
    else console.log(error)
  }
}

async function sendVerificationByEmail() {
  try {
    const auth = getAuth()
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
      console.log('Email verification sent!')
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message)
    else console.log(error)
  }
}
