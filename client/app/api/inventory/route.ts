import db from "@/app/lib/db";
import { NextResponse,NextRequest} from "next/server";
import { sendEmail } from "../alert-mails/route";
import { useSession } from "next-auth/react";
export async function GET(req:NextRequest){
    try{
        const result = await db.query("SELECT * FROM raw_materials");
        return NextResponse.json({success:true,raw_materials:result.rows})
    }catch(err){
        console.log(err);
        return NextResponse.json({success:false});
    }
}


export async function PUT(req:NextRequest){
    try{
        const{updatedItem,user}= await req.json();
        const {id,name,current_stock,min_stock,unit} = updatedItem
        await db.query("BEGIN");
        await db.query("UPDATE raw_materials SET name = $1, unit =$2, current_stock = $3, min_stock = $4 where id = $5",[name,unit,current_stock,min_stock,id]);
        await db.query("COMMIT");
        const content = `An inventory item has been UPDATED:
        - Name: ${name}
        - Current Stock: ${current_stock} ${unit}
        - Minimum Stock Level: ${min_stock}`;
        sendEmail(user,content);
        return NextResponse.json({ success: true, message: 'Updated Successfully' });
        
    }catch(err){
        console.log(err);
        return NextResponse.json({success:false});
    }
}


export async function POST(req:NextRequest){
    try{
        const{newItem,user}= await req.json();
        const {name,current_stock,min_stock,unit} = newItem;
        const res = await db.query("INSERT INTO raw_materials (name,unit,current_stock,min_stock) VALUES($1,$2,$3,$4)",[name,unit,current_stock,min_stock])
        const content = `A inventory item has been ADDED:
        - Name: ${name}
        - Current Stock: ${current_stock} ${unit}
        - Minimum Stock Level: ${min_stock}`;
        sendEmail(user,content);
        return NextResponse.json({success:true,message:"Inserted new item successfully"});
    }catch(err){
        console.log(err);
        return NextResponse.json({success:false});
    }
}


export async function DELETE(req:NextRequest){
    try{
        const{item,user}= await req.json();
        const {id,name,current_stock,unit,min_stock} = item
        await db.query('BEGIN');
        await db.query('DELETE FROM recipe_items where raw_material_id = $1',[id]);
        await db.query('DELETE FROM raw_materials where id = $1',[id]);
        await db.query('COMMIT');
        const content = `An inventory item has been DELETED:
        - Name: ${name}
        - Current Stock: ${current_stock} ${unit}
        - Minimum Stock Level: ${min_stock}`;
        sendEmail(user,content);
        return NextResponse.json({success:true,message:"Deleted "})
    }catch(err){
        await db.query('ROLLBACK')
        console.log(err);
        return NextResponse.json({success:false});
    }
}