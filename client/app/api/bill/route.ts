import { NextRequest,NextResponse } from "next/server";
import db from "@/app/lib/db";
import { sendEmail } from "../alert-mails/route";

interface BillItem {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
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

export async function POST(req: NextRequest) {
  const data: BillData = await req.json();

  try {
    // Handle update request for delivered status
    if (data.updateDelivered && data.id && typeof data.deliveredBy === "string") {
      await db.query(
        "UPDATE bills SET delivered = $1, delivered_by = $2 WHERE id = $3",
        [data.delivered, data.deliveredBy, data.id]
      );

      return NextResponse.json({ success: true, message: "Delivery status updated", billId: data.id });
    }

    // Otherwise, normal new bill creation
    const result = await db.query(
      "INSERT INTO bills (total, payment_mode, timestamp, cashier, delivered) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [data.total, data.paymentMode, data.timestamp, data.cashier, data.delivered]
    );
    const billId = result.rows[0].id;

    await Promise.all(
      data.items.map((item) =>
        db.query(
          "INSERT INTO bill_items (bill_id, item_id, name, price, category, quantity) VALUES ($1, $2, $3, $4, $5, $6)",
          [billId, item.id, item.name, item.price, item.category, item.quantity]
        )
      )
    );

    return NextResponse.json({
      success: true,
      bill: {
        id: billId,
        ...data,
      },
    });
  } catch (err: any) {
    console.error("Error in POST /api/bill:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const result = await db.query(`
    SELECT * 
    FROM bills
    WHERE (timestamp AT TIME ZONE 'Asia/Kolkata')::date = (now() AT TIME ZONE 'Asia/Kolkata')::date
  `);

    const billData: BillData[] = result.rows.map((row) => ({
      id: row.id,
      total: parseFloat(row.total),
      paymentMode: row.payment_mode,
      timestamp: row.timestamp,
      cashier: row.cashier,
      delivered: row.delivered,
      items: [],
    }));

    const res2 = await db.query("SELECT * FROM bill_items");

    // Group items by bill_id
    const itemsMap: { [key: number]: BillItem[] } = {};
    for (const row of res2.rows) {
      if (!itemsMap[row.bill_id]) {
        itemsMap[row.bill_id] = [];
      }
      itemsMap[row.bill_id].push({
        id: row.item_id,
        name: row.name,
        price: parseFloat(row.price),
        category: row.category,
        quantity: row.quantity,
      });
    }

    // Attach items to corresponding bill
    for (const bill of billData) {
        const billId = bill.id as number
      bill.items = itemsMap[billId] || [];
    }

    return NextResponse.json({ success: true, bills: billData });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}