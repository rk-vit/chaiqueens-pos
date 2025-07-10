import db from "@/app/lib/db";
import { NextRequest,NextResponse } from "next/server";
import { json } from "stream/consumers";
import bcrypt from "bcryptjs"


export async function POST(req:NextRequest){
    const {username,password} = await req.json();
    const hashed_pass = await bcrypt.hash(password,10);
    try{
        const result = await db.query('INSERT INTO ADMIN (username,password,role) VALUES($1,$2,$3)',[username,hashed_pass,'admin']);
        return NextResponse.json({success:true});
    }catch(err){
        console.log(err)
        return NextResponse.json({success:false});
    }
    
}