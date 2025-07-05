"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus } from "lucide-react"

interface CartModuleProps {
  cart: any[]
  paymentMode: string
  onSetPaymentMode: (mode: string) => void
  onAddToCart: (item: any) => void
  onRemoveFromCart: (itemId: number) => void
  onProcessBill: () => void
  toggleSelectedItems: (itemId: number) => void;
}


export function CartModule({
  cart,
  paymentMode,
  onSetPaymentMode,
  onAddToCart,
  onRemoveFromCart,
  onProcessBill,
  toggleSelectedItems
}: CartModuleProps) {
  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    //check
  }

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Current Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">No items in cart</p>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item.name}</div>
                    <div className="text-xs text-gray-500">₹{item.price} each</div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => onRemoveFromCart(item.id)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Badge variant="secondary" className="min-w-[24px] text-center">
                      {item.quantity}
                    </Badge>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => {onAddToCart(item); toggleSelectedItems(item.id)}}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-xl">
              <span>Total:</span>
              <span className="text-green-600">₹{getTotalAmount()}</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Mode</label>
              <Select value={paymentMode} onValueChange={onSetPaymentMode}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={onProcessBill} className="w-full h-12 text-lg" disabled={!paymentMode}>
              Process Bill
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
