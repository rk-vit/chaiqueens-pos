"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Receipt, Clock } from "lucide-react"
import { BillDetailModal } from "@/components/shared/bill-detail-modal"


type SalesData = {
  date: string;
  orders: number;   // should be number, not string
  revenue: number;
};

type BillItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Bill = {
  id: number;
  items: BillItem[];
  total: number;
  paymentMode: string;
  timestamp: string;
  cashier: string;
  delivered: boolean;
};

type DailyBills = Record<string, Bill[]>;

async function getStats(
  setSalesData: (salesData: SalesData[]) => void,
  setDailyBills: (dailyBills: DailyBills) => void
) {
  try {
    const res = await fetch("/api/sales", {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      console.error("Failed to fetch sales data:", res.statusText);
      return;
    }

    const data = await res.json();

    // set data in state
    setSalesData(data.sales);
    setDailyBills(data.dailyBills);

  } catch (error) {
    console.error("Error fetching sales stats:", error);
  }
}


export function SalesModule() {
  const [selectedDayBills, setSelectedDayBills] = useState<{ date: string; bills: Bill[] } | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showDayBillsModal, setShowDayBillsModal] = useState(false)
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [dailyBills , setDailyBills] = useState<DailyBills>({});
  const todayStats = salesData[0];
  useState(()=>{
    getStats(setSalesData,setDailyBills);
  })
  const avgOrderValue = todayStats && todayStats.orders > 0 
  ? todayStats.revenue / todayStats.orders 
  : 0;

  const handleDayClick = (date: string) => {
    const dayBills = dailyBills[date] || []
    setSelectedDayBills({ date, bills: dayBills })
    setShowDayBillsModal(true)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Today's Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats?.orders ?? '-'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todayStats?.revenue ?? '-'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Average Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{avgOrderValue.toFixed(2)?? '-'}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile View */}
          <div className="block md:hidden space-y-3">
            {salesData.map((day) => (
              <Card
                key={day.date}
                className="cursor-pointer hover:shadow-md transition-shadow p-4"
                onClick={() => handleDayClick(day.date)}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{day.date}</div>
                    <Badge variant="secondary">{day.orders} orders</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Revenue:</span>
                    <span className="font-medium">₹{day.revenue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Avg Order:</span>
                    <span className="font-medium">₹{(day.revenue / day.orders).toFixed(2)}</span>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((day) => (
                  <TableRow
                    key={day.date}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleDayClick(day.date)}
                  >
                    <TableCell>{day.date}</TableCell>
                    <TableCell>{day.orders}</TableCell>
                    <TableCell>₹{day.revenue}</TableCell>
                    <TableCell>₹{(day.revenue / day.orders).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Daily Bills Modal */}
      <Dialog open={showDayBillsModal} onOpenChange={setShowDayBillsModal}>
        <DialogContent className="w-[95vw] max-w-4xl mx-auto max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Bills for {selectedDayBills?.date}</DialogTitle>
          </DialogHeader>
          {selectedDayBills && (
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
              {selectedDayBills.bills.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bills found for this day</p>
              ) : (
                <div className="space-y-3">
                  {selectedDayBills.bills.map((bill) => (
                    <Card
                      key={bill.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedBill(bill)}
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
                              <div>Cashier: {bill.cashier}</div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <div className="font-bold text-lg text-green-600">₹{bill.total.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{bill.items.length} items</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bill Detail Modal */}
      <BillDetailModal bill={selectedBill} isOpen={!!selectedBill} onClose={() => setSelectedBill(null)} />
    </>
  )
}
