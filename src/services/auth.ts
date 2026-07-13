import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import type { User } from "firebase/auth"

import { auth } from "@/lib/firebase"

export const register = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)

export const logout = () => signOut(auth)

export const observeAuth = (
  callback: (user: User | null) => void,
) => onAuthStateChanged(auth, callback)
