import { NextRequest,NextResponse } from "next/server";
import dotenv from "dotenv"
import db from "@/app/lib/db";
import { CodeSquare } from "lucide-react";

export async function GET(req:NextRequest){
    const result  = await db.query("SELECT * FROM MENU");
    return NextResponse.json({message:'Okay',menu:result.rows})
}