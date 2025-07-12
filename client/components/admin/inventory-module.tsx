"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { Session } from "inspector/promises"
type InventoryItem = {
  id: number;
  name: string;
  current_stock:number;
  unit: string;
  min_stock:number;
};
type newItem = {
  name: string;
  current_stock:number;
  unit: string;
  min_stock:number;
};
async function getInventory(setInventoryItems:((Inv_items:InventoryItem[])=>void)){
  const result = await fetch("/api/inventory",{
    method:"GET",
    headers:{
      "accept":"application/json"
    }
  })
  const data = await result.json();
  console.log(data);
  setInventoryItems(data.raw_materials);
}

const updateInventoryItem = async (updatedItem: InventoryItem|null,user:string) => {

  if (!updatedItem) return;

  if (!updatedItem.name || !updatedItem.current_stock || !updatedItem.unit || !updatedItem.min_stock) return;

  try {
    // Call your API to update the item
    await fetch(`/api/inventory`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({updatedItem:updatedItem,user:user}),
    });
  } catch (err) {
    console.error("Failed to update item:", err);
  }
};
const addInventoryItem = async (newItem: newItem|null,user:string) => {
  

  if (!newItem) return;

  if (!newItem.name || !newItem.current_stock || !newItem.unit || !newItem.min_stock) return;

  try {
    // Call your API to update the item
    await fetch(`/api/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({newItem:newItem,user:user}),
    });
  } catch (err) {
    console.error("Failed to update item:", err);
  }
};
 const deleteInventoryItem = async(item:InventoryItem|null ,user:string) => {
    if (!item) return;
  try {
    // Call your API to update the item
    await fetch(`/api/inventory`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({item:item,user:user}),
    });
  } catch (err) {
    console.error("Failed to update item:", err);
  }
}

export function InventoryModule() {
  const { data: session, status } = useSession()

  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItemOpen,setEditingItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem| null>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    current_stock: 0,
    unit: "",
    min_stock: 0,
  })
  useEffect(()=>{
    getInventory(setInventory);
  },[])


  const startEdit = (item: any) => {
    setNewItem({
      name: item.name,
      current_stock: item.current_stock.toString(),
      unit: item.unit,
      min_stock: item.min_stock.toString(),
    })
  }

  
  const resetForm = () => {
    setNewItem({ name: "", current_stock: 0, unit: "", min_stock: 0 })
    setEditingItem(null);
    setIsAddItemOpen(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Inventory Management</CardTitle>
        <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Current Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newItem.current_stock}
                    onChange={(e) => setNewItem({ ...newItem, current_stock: Number.parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="kg, liters, etc."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock Level</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={newItem.min_stock}
                  onChange={(e) => setNewItem({ ...newItem, min_stock: Number.parseFloat(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={async () => {
                    if (!session?.user?.email) {
                      console.error("No user email in session");
                      return;
                    }
                    await addInventoryItem(newItem, session.user.email);
                    await getInventory(setInventory);
                    setIsAddItemOpen(false);
                    setNewItem({ name: "", current_stock: 0, unit: "", min_stock: 0 });
                  }}
                  className="flex-1"
                >
                  Add Item
                </Button>

                <Button variant="outline" onClick={() => setIsAddItemOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>



        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {inventory.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.current_stock} {item.unit}
                    </p>
                  </div>
                  <Badge variant={item.current_stock <= item.min_stock ? "destructive" : "secondary"}>
                    {item.current_stock <= item.min_stock ? "Low Stock" : "In Stock"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={editingItemOpen} onOpenChange={setEditingItemOpen}>
                    <DialogContent className="w-[95vw] max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Inventory Item</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Item Name</Label>
                          <Input
                            value={editingItem?.name}
                            onChange={(e) => setEditingItem(editingItem && { ...editingItem, name: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Current Quantity</Label>
                            <Input
                              type="number"
                              value={editingItem?.current_stock ??" "}
                              onChange={(e) => setEditingItem(editingItem && { ...editingItem, current_stock: Number.parseFloat(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Unit</Label>
                            <Input
                              value={editingItem?.unit}
                              onChange={(e) => setEditingItem(editingItem && { ...editingItem, unit: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Minimum Stock</Label>
                          <Input
                            type="number"
                            value={editingItem?.min_stock ?? ""}
                            onChange={(e) => setEditingItem(editingItem && { ...editingItem, min_stock: Number.parseFloat(e.target.value) })}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button 
                          onClick={
                            async()=>{
                              if(!session?.user?.email){
                                return console.log("No Auth")
                              }
                              await updateInventoryItem(editingItem,session?.user.email);
                              await getInventory(setInventory);
                              setEditingItemOpen(false);
                              setEditingItem(null);
                              }
                          } 
                          className="flex-1">
                            Update
                          </Button>
                          <Button variant="outline" onClick={resetForm} className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => {setEditingItem(item); setEditingItemOpen(true)}}>
                        <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{item.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async() => {
                            if(!session?.user?.email){
                              return console.log("No auth");
                            }
                            await deleteInventoryItem(item,session?.user.email); 
                            await getInventory(setInventory)
                          }}
                          className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.current_stock}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.min_stock}</TableCell>
                  <TableCell>
                    <Badge variant={Number(item.current_stock) <= Number(item.min_stock) ? "destructive" : "secondary"}>
                      {Number(item.current_stock) <= Number(item.min_stock) ? "Low Stock" : "In Stock"}
                    </Badge>

                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog open={editingItemOpen} onOpenChange={setEditingItemOpen}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Inventory Item</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Item Name</Label>
                              <Input
                                value={editingItem?.name}
                                onChange={(e) => setEditingItem(editingItem && { ...editingItem, name: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Current Quantity</Label>
                                <Input
                                  type="number"
                                  value={editingItem?.current_stock ?? ""}
                                  onChange={(e) => setEditingItem(editingItem && { ...editingItem, current_stock: Number.parseFloat(e.target.value) })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Unit</Label>
                                <Input
                                  value={editingItem?.unit}
                                  onChange={(e) => setEditingItem(editingItem && { ...editingItem, unit: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Minimum Stock</Label>
                              <Input
                                type="number"
                                value={editingItem?.min_stock??""}
                                onChange={(e) => setEditingItem(editingItem && { ...editingItem, min_stock: Number.parseFloat(e.target.value) })}
                              />
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button onClick={async()=>{
                                if(!session?.user?.email){
                                  return console.log("No auth");
                                }
                                await updateInventoryItem(editingItem,session?.user.email); 
                                await getInventory(setInventory);
                                setEditingItemOpen(false); 
                                setEditingItem(null)}} className="flex-1">
                                Update
                              </Button>
                              <Button variant="outline" onClick={resetForm} className="flex-1">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() =>{setEditingItem(item); setEditingItemOpen(true)}}>
                            <Edit className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async() => {
                                if(!session?.user?.email){
                                  return console.log("No auth")
                                }
                                await deleteInventoryItem(item,session?.user.email); 
                                await getInventory(setInventory)
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
