"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut } from "lucide-react"
import MenuModule from "@/components/cashier/menu-module"
import { CartModule } from "@/components/cashier/cart-module"
import { BillsModule } from "@/components/cashier/bills-module"
import { BillDetailModal } from "@/components/shared/bill-detail-modal"
import { OrderSuccessModal } from "@/components/order-success-modal"
import { signOut } from "next-auth/react"

interface BillItem {
  id: number;
  name: string;
  price: number;
  category: string;
  category_tamil:string;
  name_tamil:string;
  quantity: number;
}
interface MenuItem {
  id: number
  name: string
  price: number
  category: string
  category_tamil:string
  name_tamil:string
}
interface BillData {
  items: BillItem[];
  total: number;
  paymentMode: string;
  timestamp: string;
  cashier: string;
  delivered: boolean;
  id?: number;             
  deliveredBy?: string;    
  updateDelivered?: boolean; 
}
export async function getBills(setBills:React.Dispatch<React.SetStateAction<BillData[]>>){
    try{
      const result = await fetch('/api/bill',{
        method:'GET'
      }).then(res=> res.json())
      .then(data=>{
        setBills(data.bills);
      })
    }catch(err){

    }
}

export default function CashierDashboard() {
  const [bills, setBills] = useState<BillData[]>([]); // Array of BillData
  const [cart, setCart] = useState<BillItem[]>([]);
  const [paymentMode, setPaymentMode] = useState("")
  const [username, setUsername] = useState("")
  const [selectedBill, setSelectedBill] = useState<BillData | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successOrderData, setSuccessOrderData] = useState<BillData | null>(null);
  const [selectedItems,setSelectedItems] = useState<number[]>([]);
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const user = localStorage.getItem("username")

    if (role !== "cashier") {
      router.push("/")
      return
    }
    getBills(setBills)
    setUsername(user || "")
  }, [router])

  const toggleSelectedItems = (itemId:number)=>{
    
      setSelectedItems((prev)=>
        [...prev,itemId]
      )
  }
  const addToCart = (item:MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)
    if (existingItem) {
      setCart(
        cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId:number) => {

    const existingItem = cart.find((cartItem) => cartItem.id === itemId)

    // Modify Selected highli
    setSelectedItems(prev => {
      const updated = [...prev];
      const index = updated.indexOf(itemId); // id is the number you want to remove
      if (index !== -1) updated.splice(index, 1); // remove first occurrence
      return updated;
    });

    if (existingItem && existingItem.quantity > 1) {

      setCart(
        cart.map((cartItem) => (cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem)),
      )
    } else {
      setCart(cart.filter((cartItem) => cartItem.id !== itemId))
    }
  }

  const getTotalAmount = ():number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

 const processBill = async () => {
  console.log("Starting processBill...");
  if (cart.length === 0 || !paymentMode) {
    console.warn("Missing cart items or payment mode");
    return;
  }

  const newBill = {
    id: undefined,
    items: cart,
    total: getTotalAmount(),
    paymentMode,
    timestamp: new Date().toISOString(),
    cashier: username,
    delivered: false,
  };

  try {
    console.log("TRYING TO POST BILL...");
    const resp = await fetch('/api/bill', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBill),
    });

    if (!resp.ok) {

      console.error("POST failed with status", resp.status);
      return;
    }

    const data = await resp.json();
    console.log("POST successful", data);

    newBill.id = data.bill.id; // assign the generated ID
    setSelectedItems([]);

    setBills([newBill, ...bills]);
    setSuccessOrderData(newBill);
    setShowSuccessModal(true);
    setCart([]);
    setPaymentMode("");
  } catch (err) {
    console.error("Error posting bill:", err);
  }
};



  const markAsDelivered = async(billId:Number) => {
    const resp = await fetch('/api/bill', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updateDelivered:true,
        id:billId,
        deliveredBy:username,
        delivered:true
      }),
    });

    setBills(bills.map((bill) => (bill.id === billId ? { ...bill, delivered: true } : bill)))
    setSelectedBill(null)
  }

   const logout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-3 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-semibold">POS System</h1>
          <p className="text-sm text-gray-500">{username}</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-3">
        <Tabs defaultValue="billing" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="billing" className="text-sm">
              New Order
            </TabsTrigger>
            <TabsTrigger value="bills" className="text-sm">
              Today's Bills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="billing" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <MenuModule onAddToCart={addToCart} selectedItems={selectedItems} setSelectedItems={setSelectedItems} toggleSelectedItems={toggleSelectedItems}/>
              </div>
              <div>
                <CartModule
                  cart={cart}
                  paymentMode={paymentMode}
                  onSetPaymentMode={setPaymentMode}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  onProcessBill={processBill}
                  toggleSelectedItems={toggleSelectedItems}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bills">
            <BillsModule bills={bills} onBillClick={setSelectedBill} />
          </TabsContent>
        </Tabs>
      </div>

      <BillDetailModal
        bill={selectedBill}
        isOpen={!!selectedBill}
        onClose={() => setSelectedBill(null)}
        onMarkDelivered={markAsDelivered}
        showDeliveryButton={true}
      />

      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderData={successOrderData}
      />
    </div>
  )
}
