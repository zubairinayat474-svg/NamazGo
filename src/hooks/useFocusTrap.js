import { useEffect, useRef } from 'react'

/**
 * Trap focus inside a dialog and close on Escape.
 */
export function useFocusTrap(isOpen, onClose, containerRef) {
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    previousFocus.current = document.activeElement
    const node = containerRef.current
    if (!node) return undefined

    const focusable = () =>
      Array.from(
        node.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null)

    const items = focusable()
    if (items.length) items[0].focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
        return
      }
      if (e.key !== 'Tab') return

      const list = focusable()
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousFocus.current?.focus?.()
    }
  }, [isOpen, onClose, containerRef])
}
