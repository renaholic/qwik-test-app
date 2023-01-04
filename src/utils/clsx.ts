import { clsx as _clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const clsx = (...args: Parameters<typeof _clsx>) =>
  twMerge(_clsx(...args))
export default clsx
