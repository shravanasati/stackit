import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parseISO } from "date-fns"
import { toZonedTime, format } from "date-fns-tz"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TOKEN_EXPIRY_DURATION = 60 * 60 * 24 * 7 * 2 // 2 weeks

export function getNameFromEmail(email: string) {
  return email.split(".")[0];
}

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined'
}

export const nextLocalStorage = (): Storage | void => {
  if (isBrowser()) {
    return window.localStorage
  }
}

export const generateOTP = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
}

// generate a random 6 digit alphanumeric string
export function generatePostID() {
  return Math.random().toString(36).substring(2, 8);
}

// generate a random 8 digit alphanumeric string
export function generateCommentID() {
  return Math.random().toString(36).substring(2, 10);
}

export function getPostSlug(id: string, title: string) {
  return `${title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20)}_${id}`;
}

// Convert Date object to ISO string for consistent handling
export function convertTimestamp(timestamp: Date): string {
  return timestamp.toISOString()
}

export const formatDate = (timestamp: string | Date) => {
  const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp
  const istDate = toZonedTime(date, 'Asia/Kolkata')
  return format(istDate, 'yyyy-MM-dd HH:mm:ss zzz', { timeZone: 'Asia/Kolkata' })
}

export function getAgoDuration(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) {
    return `a few moments ago`
  } else if (seconds < 60 * 60) {
    return `${Math.floor(seconds / 60)} minutes ago`
  } else if (seconds < 60 * 60 * 24) {
    return `${Math.floor(seconds / 60 / 60)} hours ago`
  } else if (seconds < 60 * 60 * 24 * 7) {
    return `${Math.floor(seconds / 60 / 60 / 24)} days ago`
  } else if (seconds < 60 * 60 * 24 * 30) {
    return `${Math.floor(seconds / 60 / 60 / 24 / 7)} weeks ago`
  } else if (seconds < 60 * 60 * 24 * 365) {
    return `${Math.floor(seconds / 60 / 60 / 24 / 30)} months ago`
  } else {
    return `${Math.floor(seconds / 60 / 60 / 24 / 365)} years ago`
  }
}
