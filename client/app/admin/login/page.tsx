"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Settings } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("username", username)
      router.push("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button variant="ghost" className="absolute top-4 left-4 p-2" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Settings className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access admin panel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              defaultValue="chaiqueensadmin@axiondevs.com"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="h-12"
              defaultValue="axiondevs.com"
            />
          </div>

          <Button onClick={handleLogin} className="w-full h-12 text-lg">
            Login to Admin Panel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
