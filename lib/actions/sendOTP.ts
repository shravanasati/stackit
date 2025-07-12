'use server'

import { z } from "zod"
import { generateOTP } from "@/lib/utils"
import { getOTP, saveOTP } from "@/lib/database/firestore"
import { sendOTPEmail } from "@/lib/email"
import isRateLimited from "@/lib/ratelimit"
import { verifyCaptchaResponse } from "../captcha"

const sendOTPSchema = z.strictObject({
  username: z
    .string()
    .min(6, "Username must be at least 6 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .regex(/.*[a-zA-Z].*/, "Username must contain at least one letter"),
  email: z.string().toLowerCase(),
  tos: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
  captchaResponse: z.string().nonempty("Please complete the captcha")
})


// this action is used to generate an OTP, save it to firestore, and send it to the user's email
export async function sendOTP(values: z.infer<typeof sendOTPSchema>) {
  const result = sendOTPSchema.safeParse(values)

  if (!result.success) {
    console.error("Validation failed:", result.error);
    return { success: false, errors: result.error.flatten().fieldErrors }
  }

  try {
    if (!verifyCaptchaResponse(result.data.captchaResponse)) {
      console.error("Captcha verification failed");
      return {
        success: false, errors: {
          server: "Captcha verification failed. Please try again."
        }
      }
    }

    if (await isRateLimited(1, 60000)) {
      console.error("Rate limit exceeded");
      return { success: false, errors: { server: "Rate limit exceeded. Please try again later." } }
    }

    const otpExists = await getOTP(result.data.email)
    if (otpExists) {
      // rate limit OTPs to 1 per minute
      const expirationTime = otpExists.timestamp.toMillis() + 60000
      if (expirationTime > Date.now()) {
        return { success: false, errors: { email: "An OTP has already been sent to this email. Please check your email." }, retryAfter: new Date(expirationTime) }
      }
    }

    const otp = generateOTP().toString()
    await saveOTP(result.data.email, otp)
    await sendOTPEmail(result.data.email, otp)

    console.log(`OTP sent to ${result.data.email}`)
    return { success: true }

  } catch (error) {
    console.error(error)
    return { success: false, errors: { server: "An error occurred. Please try again." } }
  }
}