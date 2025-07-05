"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface BillDetailModalProps {
  bill: any
  isOpen: boolean
  onClose: () => void
  onMarkDelivered?: (billId: number) => void
  showDeliveryButton?: boolean
}

export function BillDetailModal({
  bill,
  isOpen,
  onClose,
  onMarkDelivered,
  showDeliveryButton = false,
}: BillDetailModalProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bill #{bill?.id}</DialogTitle>
        </DialogHeader>
        {bill && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Time:</span>
                <div className="font-medium">{formatTime(bill.timestamp)}</div>
              </div>
              {bill.cashier && (
                <div>
                  <span className="text-gray-500">Cashier:</span>
                  <div className="font-medium">{bill.cashier}</div>
                </div>
              )}
              <div>
                <span className="text-gray-500">Payment:</span>
                <div className="font-medium capitalize">{bill.paymentMode}</div>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <div>
                  <Badge variant={bill.delivered ? "default" : "secondary"} className="text-xs">
                    {bill.delivered ? "Delivered" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Items:</h4>
              <div className="space-y-2">
                {bill.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">₹{bill.total.toFixed(2)}</span>
            </div>

            {showDeliveryButton && !bill.delivered && onMarkDelivered && (
              <Button onClick={() => onMarkDelivered(bill.id)} className="w-full h-12">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Delivered
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
