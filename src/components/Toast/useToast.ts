import { use } from 'react'

import { ToastContext } from './ToastProvider'

const useToast = () => {
  const context = use(ToastContext)

  if (context === null) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  const { addToast, closeToast, closeAllToasts } = context

  return {
    addToast,
    closeToast,
    closeAllToasts,
  }
}

export { useToast }
