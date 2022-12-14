import { async } from '@firebase/util'
import { FirebaseError } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  RecaptchaVerifier,
  ConfirmationResult,
  GithubAuthProvider,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from 'firebase/auth'

export const firebaseAuthService = {
  signUp,
  signIn,
  signOut,
  doSignOut,
  ResetPasswordByEmail,
  sendVerificationByEmail,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  signInWithGoogle,
  signInWithFacebook,
  getLoggedInUser,
  signInWithGithub,
  signInByPhoneNumber,
  confirmSignInPhoneCode,
}

function getLoggedInUser() {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) return user
  return null
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
    return user
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      throw Error(error.message)
    } else {
      throw Error('cant signUp')
    }
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
    return user
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      throw Error(error.message)
    } else {
      throw Error('cant signIn')
    }
  }
}

async function doSignOut() {
  try {
    const auth = getAuth()
    await signOut(auth)
  } catch (error) {
    console.log(error)
    if (error instanceof Error) throw Error(error.message)
    else throw Error('cant signOut')
  }
}

async function ResetPasswordByEmail(email: string) {
  try {
    const auth = getAuth()
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    console.log(error)
    if (error instanceof Error) throw Error(error.message)
    else throw Error('cant ResetPasswordByEmail')
  }
}

async function sendVerificationByEmail() {
  try {
    const auth = getAuth()
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
    }
  } catch (error) {
    console.log(error)
    if (error instanceof Error) throw Error(error.message)
    else throw Error('cant sendVerificationByEmail')
  }
}

async function updateUserProfile(
  displayName?: string | null | undefined,
  photoURL?: string | null | undefined
) {
  try {
    const auth = getAuth()
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName, photoURL })
    }
  } catch (error) {
    console.log(error)
    if (error instanceof Error) throw Error(error.message)
    else throw Error('cant updateUserProfile')
  }
}
async function updateUserEmail(newEmail: string) {
  try {
    const auth = getAuth()
    if (auth.currentUser) {
      await updateEmail(auth.currentUser, newEmail)
    }
  } catch (error) {
    console.log(error)
    if (error instanceof Error) throw Error(error.message)
    else throw Error('cant updateUserEmail')
  }
}
async function updateUserPassword(newPassword: string) {
  try {
    const auth = getAuth()
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword)
    }
  } catch (error) {
    console.log(error)
    if (error instanceof Error) throw Error(error.message)
    else throw Error('cant updateUserPassword')
  }
}

// Google
async function signInWithGoogle() {
  try {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    const res = await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(res)
    if (credential) {
      const token = credential.accessToken
    }
    const signedInUser = res.user
    return signedInUser
  } catch (error) {
    console.log(error)
    if (error instanceof FirebaseError) {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData?.email
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log({ errorCode, errorMessage, email, credential })
      throw Error(error.message)
    }
    throw Error('cant signInWithGoogle')
  }
}

// facebook
async function signInWithFacebook() {
  try {
    const auth = getAuth()
    const provider = new FacebookAuthProvider()
    const res = await signInWithPopup(auth, provider)
    const credential = FacebookAuthProvider.credentialFromResult(res)
    if (credential) {
      const token = credential.accessToken
    }
    const signedInUser = res.user
    return signedInUser
  } catch (error) {
    console.log(error)
    if (error instanceof FirebaseError) {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData?.email
      const credential = FacebookAuthProvider.credentialFromError(error)
      console.log({ errorCode, errorMessage, email, credential })
      throw Error(error.message)
    }
    throw Error('cant signInWithGoogle')
  }
}

async function signInWithGithub() {
  const provider = new GithubAuthProvider()
  provider.addScope('repo')

  try {
    const auth = getAuth()
    const res = await signInWithPopup(auth, provider)
    const credential = GithubAuthProvider.credentialFromResult(res)
    if (credential) {
      const token = credential.accessToken
    }
    const signedInUser = res.user
    return signedInUser
  } catch (error) {
    console.log(error)
    if (error instanceof FirebaseError) {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData?.email
      const credential = FacebookAuthProvider.credentialFromError(error)
      console.log({ errorCode, errorMessage, email, credential })
      throw Error(error.message)
    }
    throw Error('cant signInWithGoogle')
  }
}

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier
    recaptchaWidgetId: any
    confirmationResult: ConfirmationResult
  }
}
window.recaptchaVerifier = window.recaptchaVerifier || {}
async function signInByPhoneNumber(phoneNumber: string) {
  const auth = getAuth()
  const appVerifier = window.recaptchaVerifier
  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    )
    // window.confirmationResult = confirmationResult
    return confirmationResult
  } catch (error) {
    console.log(error)
    throw Error('cant signInByPhoneNumber()')
  }
}
async function confirmSignInPhoneCode(
  confirmationResult: ConfirmationResult,
  code: string
) {
  if (!code) return
  try {
    const res = await confirmationResult.confirm(code)
    const user = res.user
    var authCredential = PhoneAuthProvider.credential(
      confirmationResult.verificationId,
      code
    )

    return user
  } catch (error) {
    console.log(error)
    throw Error('cant confirmSignInPhoneCode()')
  }
}
