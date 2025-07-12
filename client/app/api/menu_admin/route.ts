import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import { sendEmail } from "../alert-mails/route";

export async function GET(req: NextRequest) {
  const result = await db.query(`
    SELECT
      mi.id,
      mi.name,
      mi.price,
      mi.category,
      COALESCE(
        json_agg(
          json_build_object(
            'materialId', ri.raw_material_id,
            'amount', ri.quantity
          )
        ) FILTER (WHERE ri.id IS NOT NULL),
        '[]'
      ) AS rawMaterials
    FROM menu mi
    LEFT JOIN recipe_items ri ON mi.id = ri.menu_item_id
    GROUP BY mi.id, mi.name, mi.price, mi.category
  `);

  return NextResponse.json({ message: 'Okay', menu: result.rows });
}


export async function PUT(req: NextRequest) {
  try {
    const {editingItem,user} = await req.json();
    const { id, name, price, category, rawMaterials } = editingItem;

    await db.query('BEGIN');

    await db.query(
      'UPDATE menu SET name = $1, price = $2, category = $3 WHERE id = $4',
      [name, price, category, id]
    );

    await db.query('DELETE FROM recipe_items WHERE menu_item_id = $1', [id]);

    for (const material of rawMaterials) {
      await db.query(
        'INSERT INTO recipe_items (menu_item_id, raw_material_id, quantity) VALUES ($1, $2, $3)',
        [id, material.materialId, material.amount]
      );
    }

    await db.query('COMMIT');
    const content = `An menu item has been UPDATED:
            - Name: ${name}
            - Price: ${price}
            - Category: ${category}
            `;
    sendEmail(user,content);
    return NextResponse.json({ success: true, message: 'Menu item updated' });

  } catch (err) {
    console.error(err);
    await db.query('ROLLBACK');
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const {newItem,user} = await req.json();
    console.log(newItem)
    const { name, price, category, rawMaterials } = await newItem;
    console.log("REQUEST TO POST")
    await db.query('BEGIN');

    // Insert new menu item and get its id
    const insertResult = await db.query(
      'INSERT INTO menu (name, price, category) VALUES ($1, $2, $3) RETURNING id',
      [name, price, category]
    );

    const newItemId = insertResult.rows[0].id;

    // Insert raw materials (if any)
    for (const material of rawMaterials) {
      await db.query(
        'INSERT INTO recipe_items (menu_item_id, raw_material_id, quantity) VALUES ($1, $2, $3)',
        [newItemId, material.materialId, material.amount]
      );
    }
    const content = `An menu item has been ADDED:
            - Name: ${name}
            - Price: ${price}
            - Category: ${category}
            `;
    sendEmail(user,content);
    await db.query('COMMIT');
    console.log("Successfull posted")
    return NextResponse.json({ success: true, message: 'Menu item created', id: newItemId });
  } catch (err) {
    console.error(err);
    await db.query('ROLLBACK');
    return NextResponse.json({ success: false, message: 'Create failed' }, { status: 500 });
  }
}



export async function DELETE(req: NextRequest) {
  try {
    const { item ,user} = await req.json();    // get the id to delete
    const { id, name, price, category, rawMaterials } = item;

    await db.query('BEGIN');

    // First delete associated raw materials (recipe items)
    await db.query('DELETE FROM recipe_items WHERE menu_item_id = $1', [id]);

    // Then delete the menu item itself
    await db.query('DELETE FROM menu WHERE id = $1', [id]);

    await db.query('COMMIT');
    const content = `An menu item has been DELETED:
            - Name: ${name}
            - Price: ${price}
            - Category: ${category}
            `;
    sendEmail(user,content);
    return NextResponse.json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    console.error(err);
    await db.query('ROLLBACK');
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 500 });
  }
}
