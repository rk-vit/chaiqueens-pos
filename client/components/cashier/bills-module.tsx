"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, Clock } from "lucide-react"

interface BillsModuleProps {
  bills: any[]
  onBillClick: (bill: any) => void
}

export function BillsModule({ bills, onBillClick }: BillsModuleProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Bills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bills.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No bills found for today</p>
          ) : (
            bills.map((bill) => (
              <Card
                key={bill.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onBillClick(bill)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Receipt className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="font-medium">Bill #{bill.id}</span>
                        <Badge variant={bill.delivered ? "default" : "secondary"} className="text-xs">
                          {bill.delivered ? "Delivered" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(bill.timestamp)}
                        </div>
                        <div className="capitalize">{bill.paymentMode}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="font-bold text-lg text-green-600">₹{bill.total.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{bill.items.length} items</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
