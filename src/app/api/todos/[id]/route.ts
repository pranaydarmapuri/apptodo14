import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbConfig/db"
import Todo from "@/models/todo"
import {v4} from "uuid";


connect()
function getIdFromPathname(s:String){
    let parts=s.split("/");
    console.log(parts)
    return parts[parts.length - 1];
}

export async function GET(request:NextRequest){
    try{
        const path=request.nextUrl.pathname;
        console.log(path)
        const id=getIdFromPathname(path)
        const todo = await Todo.findOne({id})
        console.log(todo)
        
        return NextResponse.json({msg:"Found all todos",success:true,todo})
    }catch(error){
        return NextResponse.json({msg:"Issue happend"},{status:500})
    }
}
