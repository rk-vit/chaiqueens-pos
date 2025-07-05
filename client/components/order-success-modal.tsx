"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Sparkles, Coffee } from "lucide-react"


interface BillItem {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
}

interface BillData {
  id?: number;
  items: BillItem[];
  total: number;
  paymentMode: string;
  timestamp: string;
  cashier: string;
  delivered: boolean;
  deliveredBy?: string;
  updateDelivered?: boolean;
}

interface OrderSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: BillData | null
}


export function OrderSuccessModal({ isOpen, onClose, orderData }: OrderSuccessModalProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowContent(true)
      const timer = setTimeout(() => {
        setShowContent(false)
        setTimeout(onClose, 300)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen || !orderData) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`transform transition-all duration-500 ${
          showContent ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <Card className="w-full max-w-sm mx-auto bg-white shadow-2xl">
          <CardContent className="p-6 text-center space-y-4">
            {/* Success Animation */}
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 relative overflow-hidden">
                <CheckCircle className="w-12 h-12 text-green-600 animate-bounce" />

                {/* Sparkle effects */}
                <div className="absolute top-2 right-2 animate-ping">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="absolute bottom-2 left-2 animate-ping delay-150">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                </div>
                <div className="absolute top-3 left-3 animate-ping delay-300">
                  <Sparkles className="w-2 h-2 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-600">Order Placed!</h2>
              <p className="text-gray-600">Your order has been successfully processed</p>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Order #</span>
                <Badge variant="secondary">{orderData.id}</Badge>
              </div>

              <div className="space-y-1">
                {orderData.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {orderData.items.length > 2 && (
                  <div className="text-sm text-gray-500">+{orderData.items.length - 2} more items</div>
                )}
              </div>

              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-green-600">₹{orderData.total.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Coffee className="w-4 h-4" />
                <span>Paid via {orderData.paymentMode.toUpperCase()}</span>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
            </div>

            <p className="text-xs text-gray-500">Preparing your order...</p>
          </CardContent>
        </Card>
      </div>

      {/* Confetti effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-70"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
