"use client"

import { useEffect } from "react"

export function useHotkeys(hotkeys) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      const ctrl = e.ctrlKey
      const alt = e.altKey
      const shift = e.shiftKey

      for (const [combo, handler] of Object.entries(hotkeys)) {
        const parts = combo.toLowerCase().split("+")
        const needsCtrl = parts.includes("ctrl")
        const needsAlt = parts.includes("alt")
        const needsShift = parts.includes("shift")
        const targetKey = parts[parts.length - 1]

        if (key === targetKey && ctrl === needsCtrl && alt === needsAlt && shift === needsShift) {
          e.preventDefault()
          handler(e)
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [hotkeys])
}
