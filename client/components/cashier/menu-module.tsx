"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"

interface MenuItem {
  id: number
  name: string
  price: number
  category: string
  category_tamil:string
  name_tamil:string
}

interface MenuModuleProps {
  onAddToCart: (item: MenuItem) => void;
  selectedItems : number[];
  setSelectedItems : React.Dispatch<React.SetStateAction<number[]>>;
  toggleSelectedItems:(itemId: number) => void;
}

async function getMenu(setMenu: (menu: MenuItem[]) => void) {
  try {
    const res = await fetch("/api/menu/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    setMenu(data.menu)
  } catch (err) {
    console.log(err)
  }
}

const MenuModule:React.FC<MenuModuleProps> = ({onAddToCart,setSelectedItems,selectedItems,toggleSelectedItems})=> {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({})
  useEffect(() => {
    getMenu(setMenu)
  }, [])

  

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const categories: { category_en: string; category_tamil: string }[] = [];
  menu.forEach((item) => {
    if (!categories.find((c) => c.category_en === item.category)) {
      categories.push({
        category_en: item.category,
        category_tamil: item.category_tamil
      });
    }
  });
  
  const getItemCount = (id:number) =>{
    return selectedItems.filter(itemId => itemId == id).length
  }
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Menu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map((category) => (
          <Collapsible
            key={category.category_en}
            open={!!expandedCategories[category.category_en]}
            onOpenChange={() => toggleCategory(category.category_en)}
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-12 text-left">
                <span className="font-medium">{category.category_en}</span>
                <span className="font-medium">{category.category_tamil}</span>
                {expandedCategories[category.category_en] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="grid grid-cols-2 gap-2">
                {menu
                  .filter((item) => item.category === category.category_en)
                  .map((item) => (
                    getItemCount(item.id) > 0 ? 
                      <Card
                      key={item.id}
                      className="cursor-pointer hover:shadow-md transition-shadow active:scale-95 bg-green-600"
                      onClick={() => {onAddToCart(item); toggleSelectedItems(item.id)}}
                      >
                      <CardContent className="p-3">
                        <div className="text-sm font-bold leading-tight">{item.name} / {item.name_tamil}</div>
                        <div className="text-lg font-bold text-black-600">₹{item.price}</div>
                        <div className="text-xl text-black-700 mt-2 font-bold">
                           {getItemCount(item.id)} {getItemCount(item.id) === 1 ? "item" : "items"}
                        </div>
                      </CardContent>
                    </Card>
                    :
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:shadow-md transition-shadow active:scale-95"
                      onClick={() => {onAddToCart(item); toggleSelectedItems(item.id)}}
                    >
                      <CardContent className="p-3">
                        <div className="text-sm font-medium leading-tight">{item.name} / {item.name_tamil}</div>
                        <div className="text-lg font-bold text-green-600">₹{item.price}</div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  )
}


export default MenuModule;