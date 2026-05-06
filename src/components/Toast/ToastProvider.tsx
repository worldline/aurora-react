'use client'

import { createContext, type PropsWithChildren } from 'react'

import { type ToastContent, toastService } from './toast.service'

const ToastContext = createContext<{
  addToast: (toast: ToastContent) => void
  closeToast: (id: string) => void
  closeAllToasts: () => void
} | null>(null)

const ToastProvider = ({ children }: PropsWithChildren) => (
  <ToastContext
    value={{
      addToast: toastService.addToast.bind(toastService),
      closeToast: toastService.closeToast.bind(toastService),
      closeAllToasts: toastService.closeAllToasts.bind(toastService),
    }}
  >
    {children}
  </ToastContext>
)

export { ToastProvider, ToastContext }
