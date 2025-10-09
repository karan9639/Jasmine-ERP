"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/state/useAppStore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { FormField } from "@/components/forms/FormField"

export function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { setUser, addToast } = useAppStore()
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    // Mock authentication
    if (username && password) {
      setUser({ name: username, role: "admin" })
      addToast({ type: "success", message: "Login successful" })
      navigate("/company-selection")
    } else {
      addToast({ type: "error", message: "Please enter username and password" })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">ERP System Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <FormField label="Username" required>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoFocus
              />
            </FormField>

            <FormField label="Password" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </FormField>

            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
