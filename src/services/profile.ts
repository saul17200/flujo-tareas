import {
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth"

import { auth } from "@/lib/firebase"

export async function updateUserDisplayName(
  user: User,
  displayName: string,
) {
  await updateProfile(user, {
    displayName,
  })

  await reload(user)
}

export async function sendUserVerification(user: User) {
  await sendEmailVerification(user)
}

export async function sendUserPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email)
}
