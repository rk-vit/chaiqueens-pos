import db from "@/app/lib/db";
import { NextResponse,NextRequest} from "next/server";

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

        const {id,name,current_stock,min_stock,unit} = await req.json();
        await db.query("BEGIN");
        await db.query("UPDATE raw_materials SET name = $1, unit =$2, current_stock = $3, min_stock = $4 where id = $5",[name,unit,current_stock,min_stock,id]);
        await db.query("COMMIT");
        return NextResponse.json({ success: true, message: 'Updated Successfully' });
        
    }catch(err){
        console.log(err);
        return NextResponse.json({success:false});
    }
}


export async function POST(req:NextRequest){
    try{
        const {name,current_stock,min_stock,unit} = await req.json();
        const res = await db.query("INSERT INTO raw_materials (name,unit,current_stock,min_stock) VALUES($1,$2,$3,$4)",[name,unit,current_stock,min_stock])
        return NextResponse.json({success:true,message:"Inserted new item successfully"});
    }catch(err){
        console.log(err);
        return NextResponse.json({success:false});
    }
}


export async function DELETE(req:NextRequest){
    try{
        const {id} = await req.json();
        await db.query('BEGIN');
        await db.query('DELETE FROM recipe_items where raw_material_id = $1',[id]);
        await db.query('DELETE FROM raw_materials where id = $1',[id]);
        await db.query('COMMIT');
        return NextResponse.json({success:true,message:"Deleted "})
    }catch(err){
        await db.query('ROLLBACK')
        console.log(err);
        return NextResponse.json({success:false});
    }
}