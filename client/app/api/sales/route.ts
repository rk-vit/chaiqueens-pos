import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Fetch sales summary
    const salesResult = await db.query(`
      SELECT
        TO_CHAR(DATE(timestamp), 'YYYY-MM-DD') AS date,
        COUNT(*)::int AS orders,
        COALESCE(SUM(total),0)::float AS revenue
      FROM bills
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `);

    // 2️⃣ Fetch all bills with items
    const billsResult = await db.query(`
      SELECT
        b.id,
        b.total::float,
        b.payment_mode AS "paymentMode",
        b.timestamp,
        b.cashier,
        b.delivered,
        TO_CHAR(DATE(b.timestamp), 'YYYY-MM-DD') AS date,
        json_agg(
          json_build_object(
            'id', bi.item_id,
            'name', mi.name,
            'price', bi.price::float,
            'quantity', bi.quantity::int
          )
        ) AS items
      FROM bills b
      JOIN bill_items bi ON b.id = bi.bill_id
      JOIN menu mi ON bi.item_id = mi.id
      GROUP BY b.id
      ORDER BY b.timestamp DESC
    `);

    // 3️⃣ Group bills by date
    const dailyBills: Record<string, any[]> = {};
    for (const bill of billsResult.rows) {
      const date = bill.date;
      if (!dailyBills[date]) dailyBills[date] = [];
      dailyBills[date].push({
        id: bill.id,
        total: bill.total,
        paymentMode: bill.paymentMode,
        timestamp: bill.timestamp,
        cashier: bill.cashier,
        delivered: bill.delivered,
        items: bill.items,
      });
    }

    return NextResponse.json({
      sales: salesResult.rows,
      dailyBills,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to fetch sales data" }, { status: 500 });
  }
}
