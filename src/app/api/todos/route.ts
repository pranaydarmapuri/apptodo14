import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/db';
import Todo from '@/models/todo';
import { verifyToken } from '../auth/tokenUtills';
import { v4 } from 'uuid';

connect();

export async function GET(request: NextRequest) {
    try {
      
      const decoded = verifyToken(request);
      console.log('Decoded Token:', decoded);
  
      
      if (!decoded) {
        return NextResponse.json({ msg: 'Unauthorized', success: false }, { status: 401 });
      }
  
      
      const todos = await Todo.find({});
      console.log(todos);
  
      
      return NextResponse.json({ msg: 'Found all todos', success: true, todos });
    } catch (error) {
      console.error('Error fetching todos:', error);
      return NextResponse.json({ msg: 'Issue happened' }, { status: 500 });
    }
  }
  
  export async function POST(request: NextRequest) {
    try {
      
      const decoded = verifyToken(request);
      const token = request.headers.get('Authorization');
      console.log('Raw Authorization Header:', token);
  
      
      if (!decoded) {
        return NextResponse.json({ msg: 'Unauthorized', success: false }, { status: 401 });
      }
  
      const reqBody = await request.json();
      const { desc } = reqBody;
  
      const newTodo = new Todo({
        id: v4(),
        desc,
        completed: false,
      });
  
      const savedTodo = await newTodo.save();
      return NextResponse.json({ msg: 'Todo added', success: true, savedTodo });
    } catch (error) {
      console.error('Error adding todo:', error);
      return NextResponse.json({ msg: 'Issue happened' }, { status: 500 });
    }
  }
  
  export async function DELETE(request: NextRequest) {
    try {
      
      const decoded = verifyToken(request);
  
      
      if (!decoded) {
        return NextResponse.json({ msg: 'Unauthorized', success: false }, { status: 401 });
      }
  
      await Todo.deleteMany({});
      return NextResponse.json({ msg: 'Todo cleared', success: true });
    } catch (error) {
      console.error('Error deleting todos:', error);
      return NextResponse.json({ msg: 'Issue happened' }, { status: 500 });
    }
  }