"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut } from "lucide-react"
import { InventoryModule } from "@/components/admin/inventory-module"
import { MenuManagementModule } from "@/components/admin/menu-management-module"
import { SalesModule } from "@/components/admin/sales-module"
import { signOut,useSession } from "next-auth/react"

export default function AdminDashboard() {
  const [username, setUsername] = useState("")
  const router = useRouter()
  const { data: session, status } = useSession()
  
  useEffect(() => {
  console.log("session:", session);
  if (session?.user?.email) {
    setUsername(session.user.email);
  } else {
    const user = localStorage.getItem("username");
    setUsername(user || "");
  }
}, [session, status]);


 const logout = () => {
  localStorage.removeItem("userRole")
  localStorage.removeItem("username")
  signOut({ callbackUrl: "/" })
}

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin Dashboard - {username}</h1>
        <Button variant="outline" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="p-4">
        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="sales">Sales Tracker</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <InventoryModule />
          </TabsContent>

          <TabsContent value="menu">
            <MenuManagementModule />
          </TabsContent>
        
        <TabsContent value="sales">
            {session?.user.id===3?
                <SalesModule />
            :<h1>Access Restricted</h1>}
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
