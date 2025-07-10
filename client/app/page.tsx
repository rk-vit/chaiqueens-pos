"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, UserCheck, Settings } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <Coffee className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl"> Chai Queens POS</CardTitle>
          <CardDescription>Select your role to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => router.push("/cashier/login")} className="w-full h-14 text-lg" variant="default">
            <UserCheck className="w-5 h-5 mr-3" />
            Cashier Login
          </Button>
    
          <Button onClick={() => router.push("/admin/login")} className="w-full h-14 text-lg" variant="outline" disabled>
            <Settings className="w-5 h-5 mr-3" />
            Admin Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

