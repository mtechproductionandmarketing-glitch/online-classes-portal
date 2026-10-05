'use client'

import { useState, useEffect } from 'react'

export interface AlertProps {
  type?: 'error' | 'success' | 'info' | 'warning'
  title?: string
  message: string
  onClose?: () => void
  autoClose?: boolean
  autoCloseDuration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function ErrorAlert({
  type = 'error',
  title,
  message,
  onClose,
  autoClose = false,
  autoCloseDuration = 5000,
  action,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!autoClose || !isVisible) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, autoCloseDuration)

    return () => clearTimeout(timer)
  }, [autoClose, autoCloseDuration, onClose, isVisible])

  if (!isVisible) return null

  const typeConfig = {
    error: {
      className: 'bg-red-50 border-red-200 text-red-800',
      icon: '✕',
      iconColor: 'text-red-600',
    },
    success: {
      className: 'bg-green-50 border-green-200 text-green-800',
      icon: '✓',
      iconColor: 'text-green-600',
    },
    info: {
      className: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'ℹ',
      iconColor: 'text-blue-600',
    },
    warning: {
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: '⚠',
      iconColor: 'text-yellow-600',
    },
  }

  const config = typeConfig[type]

  return (
    <div className={`border border-l-4 px-4 py-3 rounded-lg ${config.className}`} role="alert">
      <div className="flex items-start gap-3">
        <span className={`text-xl font-bold ${config.iconColor} flex-shrink-0`}>
          {config.icon}
        </span>
        <div className="flex-1">
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div className="text-sm">{message}</div>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 underline hover:no-underline font-semibold text-sm"
            >
              {action.label}
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
            className="flex-shrink-0 text-lg leading-none opacity-70 hover:opacity-100"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export function FormFieldError({ error }: { error?: string }) {
  if (!error) return null

  return <div className="error-message">{error}</div>
}

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const typeConfig = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }

  return (
    <div
      className={`fixed bottom-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg ${typeConfig[type]} fade-in`}
    >
      {message}
    </div>
  )
}
