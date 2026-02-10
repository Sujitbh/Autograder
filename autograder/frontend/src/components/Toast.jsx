import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const COLORS = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
}

const ICON_COLORS = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-amber-500',
}

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    show: addToast,
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    dismiss: removeToast,
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }) {
  const Icon = ICONS[toast.type]
  
  return (
    <div 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
        pointer-events-auto animate-slide-in
        ${COLORS[toast.type]}
      `}
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${ICON_COLORS[toast.type]}`} />
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-2 p-1 rounded-lg hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Global toast function for use outside React components
const toastQueue = []
let toastHandler = null

export function setToastHandler(handler) {
  toastHandler = handler
  // Process queued toasts
  while (toastQueue.length > 0) {
    const { message, type, duration } = toastQueue.shift()
    handler.show(message, type, duration)
  }
}

export const globalToast = {
  show: (message, type = 'info', duration = 5000) => {
    if (toastHandler) {
      return toastHandler.show(message, type, duration)
    }
    toastQueue.push({ message, type, duration })
  },
  success: (message, duration) => globalToast.show(message, 'success', duration),
  error: (message, duration) => globalToast.show(message, 'error', duration),
  info: (message, duration) => globalToast.show(message, 'info', duration),
  warning: (message, duration) => globalToast.show(message, 'warning', duration),
}

export default ToastProvider
