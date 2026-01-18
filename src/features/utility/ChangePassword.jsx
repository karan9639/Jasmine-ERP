'use client';

import { useState } from "react"
import { PageShell } from "@/components/layout/PageShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useAppStore } from "@/state/useAppStore"
import { Lock, Eye, EyeOff, Check } from "lucide-react"

export function ChangePassword() {
  const { addToast, user } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.currentPassword) newErrors.currentPassword = "Current password is required"
    if (!formData.newPassword) newErrors.newPassword = "New password is required"
    if (formData.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters"
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    
    addToast({ type: "success", message: "Password changed successfully" })
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const passwordStrength = () => {
    const pwd = formData.newPassword
    if (!pwd) return { strength: 0, label: "" }
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    
    if (score <= 2) return { strength: 33, label: "Weak", color: "bg-red-500" }
    if (score <= 4) return { strength: 66, label: "Medium", color: "bg-yellow-500" }
    return { strength: 100, label: "Strong", color: "bg-green-500" }
  }

  const strength = passwordStrength()

  return (
    <PageShell title="Change Password">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Your Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  error={errors.currentPassword}
                  required
                />
                <button type="button" onClick={() => togglePasswordVisibility("current")} className="absolute right-3 top-9 text-muted-foreground hover:text-foreground">
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="New Password"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  error={errors.newPassword}
                  required
                />
                <button type="button" onClick={() => togglePasswordVisibility("new")} className="absolute right-3 top-9 text-muted-foreground hover:text-foreground">
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {formData.newPassword && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Password Strength</span>
                    <span className={strength.strength === 100 ? "text-green-600" : strength.strength === 66 ? "text-yellow-600" : "text-red-600"}>{strength.label}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${strength.color}`} style={{ width: `${strength.strength}%` }} />
                  </div>
                </div>
              )}

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  error={errors.confirmPassword}
                  required
                />
                <button type="button" onClick={() => togglePasswordVisibility("confirm")} className="absolute right-3 top-9 text-muted-foreground hover:text-foreground">
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                  <Check className="absolute right-10 top-9 w-4 h-4 text-green-500" />
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Changing Password..." : "Change Password"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Password Requirements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className={formData.newPassword.length >= 6 ? "text-green-600" : ""}>- At least 6 characters</li>
                <li className={/[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""}>- One uppercase letter</li>
                <li className={/[0-9]/.test(formData.newPassword) ? "text-green-600" : ""}>- One number</li>
                <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? "text-green-600" : ""}>- One special character (recommended)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

export default ChangePassword
