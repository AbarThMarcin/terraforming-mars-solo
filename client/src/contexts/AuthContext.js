import { useContext, useState, useEffect, createContext } from 'react'
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
   onAuthStateChanged,
   sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from '../firebase/firebase.config'
import { validateUser } from '../api'

const AuthContext = createContext()

export function useAuth() {
   return useContext(AuthContext)
}

export function AuthProvider({ children }) {
   const [currentUser, setCurrentUser] = useState()

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (user) {
            user.getIdToken().then((token) => {
               validateUser(token)
                  .then((data) => {
                     setCurrentUser(data)
                  })
                  .catch((error) => {})
            })
         } else {
            setCurrentUser(null)
         }
      })
      console.log('new branch')
      return unsubscribe
   }, [])

   function register(email, password) {
      return createUserWithEmailAndPassword(auth, email, password)
   }

   function login(email, password) {
      return signInWithEmailAndPassword(auth, email, password)
   }

   function logout() {
      return signOut(auth)
   }

   function resetPassword(email) {
      return sendPasswordResetEmail(auth, email)
   }

   function getToken() {
      if (!currentUser) return false
      return currentUser.getIdToken()
   }

   const value = {
      currentUser,
      login,
      register,
      logout,
      resetPassword,
      getToken,
   }

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
