"use server"

import { cookies } from "next/headers"
import { decrypt } from "./crypt"
import { deleteToken, getToken } from "./firebase/firestore"
import { cache } from "react"
import { Timestamp } from "firebase-admin/firestore"
import { TOKEN_EXPIRY_DURATION } from "./utils"

type Role = "admin" | "user"

export type User = {
	token: string | undefined;
	role: Role | undefined;
}

export const getAuthUser = cache(async () => {
	const session = cookies().get("session")
	if (!session) {
		return null
	}

	try {
		const tokenObj: User = JSON.parse(decrypt(session.value))
		if (!tokenObj.token) {
			return null
		}
		if (!tokenObj.role) {
			return null
		}
		const dbToken = await getToken(tokenObj.token)
		if (!dbToken) {
			return null
		}

		if (dbToken.token !== tokenObj.token || dbToken.role !== tokenObj.role) {
			deleteToken(tokenObj.token).catch(console.error)
			return null
		}

		const now = Timestamp.now()
		const expiryTime = dbToken.timestamp.seconds + TOKEN_EXPIRY_DURATION
		if (now.seconds > expiryTime) {
			deleteToken(tokenObj.token).catch(console.error)
			return null
		}

		return tokenObj
	}
	catch (error) {
		console.error("error in getAuthUser", error)
		return null
	}
})
