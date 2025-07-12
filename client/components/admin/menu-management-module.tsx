"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"
type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  rawMaterials: { materialId: number; amount: number }[];
};
type NewMenuItem = {
  name: string;
  price: number;
  category: string;
  rawMaterials: { materialId: number; amount: number }[];
};
type InventoryItem = {
  id: number;
  name: string;
  unit: string;
};


async function getMenu(setMenuItems: (menu: MenuItem[]) => void) {
  const result = await fetch("/api/menu_admin", { method: "GET", headers: { accept: "application/json" } });
  const data = await result.json();

  // transform rawmaterials -> rawMaterials
  const transformedMenu = data.menu.map((item: any) => ({
    ...item,
    rawMaterials: item.rawmaterials ?? [],
  }));
  setMenuItems(transformedMenu);
}
async function updateMenu(editingItem: MenuItem,user:string) {
  console.log("Update requested");
  const res = await fetch("/api/menu_admin", {
    method: "PUT",                            // use correct HTTP method
    headers: {
      "Content-Type": "application/json",     // tell server you're sending JSON
      "Accept": "application/json",
    },
    body: JSON.stringify({editingItem:editingItem,user:user}),        // send the actual item
  });

  const data = await res.json();
  console.log("Response from server:", data);
  return data;
}

async function addMenuItem (newItem:NewMenuItem,user:string){
    if (!newItem?.name || !newItem.price || !newItem.category) return
    const res = await fetch("/api/menu_admin", {
    method: "POST",                            // use correct HTTP method
    headers: {
      "Content-Type": "application/json",     // tell server you're sending JSON
      "Accept": "application/json",
    },
    body: JSON.stringify({newItem:newItem,user:user}),        // send the actual item
  });
    
    
  }
async function deleteMenuItem(item:MenuItem,user:string){
  const res = await fetch("/api/menu_admin",{
    method:"DELETE",
    headers:{
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body:JSON.stringify({item:item,user})
  }

  )
}
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
export function MenuManagementModule() {
    const { data: session, status } = useSession()

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [inventoryItems,setInventoryItems] = useState<InventoryItem[]>([])
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isEditItemOpen, setIsEditItemOpen] = useState(false)
  const [editingItem,setEditingItem] = useState<MenuItem|null>(null)
  const [addingNewCategory, setAddingNewCategory] = useState(false);
  
  const [newItem, setNewItem] = useState<NewMenuItem|null>(null)
  useEffect(()=>{
    getMenu(setMenuItems);
    getInventory(setInventoryItems);
  },[])
  const uniqueCategories = Array.from(
  new Set(menuItems.map(item => item.category))
  );


  const addRawMaterial = () => {
  setEditingItem(editingItem && {
    ...editingItem,
    rawMaterials: [
      ...(editingItem.rawMaterials ?? []),
      { materialId: 0, amount: 0 }
    ],
  });
  };
   const addRawMaterial_1 = () => {
      setNewItem(newItem && {
        ...newItem,
        rawMaterials: [
          ...(newItem.rawMaterials ?? []),
          { materialId: 0, amount: 0 }
        ],
      });
  };


const updateRawMaterial = (index: number, field: string, value: string) => {
  if (!editingItem) return;

  const updated = editingItem.rawMaterials.map((material, i) =>
    i === index
      ? { ...material, [field]: Number(value) }
      : material
  );

  setEditingItem({ ...editingItem, rawMaterials: updated });
};
const updateRawMaterial_1 = (index: number, field: string, value: string) => {
  if (!newItem) return;

  const updated = newItem.rawMaterials.map((material, i) =>
    i === index
      ? { ...material, [field]: Number(value) }
      : material
  );

  setNewItem({ ...newItem, rawMaterials: updated });
};

  const removeRawMaterial = (index: number) => {
    if(!editingItem) return
    const updated = editingItem?.rawMaterials.filter((_, i) => i !== index)
    setEditingItem({ ...editingItem, rawMaterials: updated })
  }
  const removeRawMaterial_1 = (index: number) => {
    if(!newItem) return
    const updated = newItem?.rawMaterials.filter((_, i) => i !== index)
    setNewItem({ ...newItem, rawMaterials: updated })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Menu Management</CardTitle>
        <Dialog open={isAddItemOpen} onOpenChange={(open) => {
            setIsAddItemOpen(open);
            if (open) {
              setNewItem({ name: "", price: 0, category: "", rawMaterials: [] });
              setAddingNewCategory(false);
            }
          }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Item Name</Label>
                  <Input value={newItem?.name} onChange={(e) => setNewItem(newItem && { ...newItem, name: e.target.value })} />
                  
                </div>
                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newItem?.price}
                    onChange={(e) => setNewItem(newItem && { ...newItem, price: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={newItem?.category}
                  onValueChange={(value) => {
                    if (value === "__new__") {
                      setAddingNewCategory(true);
                      setNewItem(newItem && { ...newItem, category: "" });
                    } else {
                      setAddingNewCategory(false);
                      setNewItem(newItem && { ...newItem, category: value });
                    }
                  }}
                >

                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.map((category)=>(
                        <SelectItem key={category} value={category}>
                              {category}
                        </SelectItem>
                    ))}
                    <SelectItem value="__new__">+ Add new category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                {addingNewCategory && 
                  <Input
                    placeholder="Enter new category"
                    onChange={(e) => setNewItem(newItem && { ...newItem, category: e.target.value })}
                  />
                }

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Raw Materials</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addRawMaterial_1}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Material
                  </Button>
                </div>

                {newItem?.rawMaterials.map((material, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Select
                      value={material.materialId?.toString()||""}
                      onValueChange={(value) => updateRawMaterial_1(index, "materialId", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      className="w-24"
                      value={material.amount}
                      onChange={(e) => updateRawMaterial_1(index, "amount", e.target.value)}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => removeRawMaterial_1(index)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={async () => {
                    
                    if (newItem) {
                      try {
                        if (!session?.user?.email) {
                          console.log("No auth");
                          return;
                        }
                        await addMenuItem(newItem,session?.user.email);
                        await getMenu(setMenuItems);
                      } catch (err) {
                        console.error("Failed to add item", err);
                        // optionally show toast / error to user
                      } finally {
                        setNewItem({ name: "", price: 0, category: "", rawMaterials: [] });
                        setIsAddItemOpen(false);
                      }
                    }
                  }}
                >
                    Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        


        <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modify Menu Item </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Item Name</Label>
                  <Input value={editingItem?.name} onChange={(e) =>setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)} />
                </div>
                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingItem?.price}
                    onChange={(e) =>setEditingItem(prev => prev ? { ...prev, price: Number.parseFloat(e.target.value ) } : null)}
                  />
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={editingItem?.category} onValueChange={(value) => setEditingItem(editingItem && { ...editingItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.map((category)=>(
                      <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Raw Materials</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addRawMaterial}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Material
                  </Button>
                </div>

                {editingItem?.rawMaterials.map((material, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Select
                      value={material.materialId?.toString() ?? ""}
                      onValueChange={(value) => updateRawMaterial(index, "materialId", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      className="w-24"
                      value={material.amount}
                      onChange={(e) => updateRawMaterial(index, "amount", e.target.value)}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => removeRawMaterial(index)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {setIsEditItemOpen(false)}}>
                  Cancel
                </Button>
                <Button onClick={()=>{
                  if(!session?.user?.email){
                    return console.log("No auth")
                  }
                  editingItem && updateMenu(editingItem,session?.user.email); 
                  setIsEditItemOpen(false)
                  }}>
                    Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>




















      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Raw Materials</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  {
                      (item.rawMaterials?.length??0) > 0 ? (
                      item.rawMaterials.map((material) => {
                        const inventoryItem = inventoryItems.find((inv) => inv.id === material.materialId);
                        return inventoryItem ? (
                          <div key={material.materialId} className="text-xs">
                            {inventoryItem.name}: {material.amount} {inventoryItem.unit}
                          </div>
                        ) : null;
                      })
                    ) : (
                      <div className="text-xs italic text-gray-400">No raw materials</div>
                    )
                  }

                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={()=>{setIsEditItemOpen(true); console.log("editing item:- ",item.name);setEditingItem(item)}}>
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
                            if(!session?.user.email){
                          return console.log("Hii");
                        }
                        await deleteMenuItem(item,session?.user.email);
                        getMenu(setMenuItems)
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
      </CardContent>
    </Card>
  )
}
