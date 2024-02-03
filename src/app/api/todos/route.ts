// pages/api/todos.ts
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/db';
import Todo from '@/models/todo';
import { verifyToken } from '../auth/tokenUtills';
import { v4 } from 'uuid';



connect();



function getSessionId(request: NextRequest) {
  return request.headers.get('X-Session-ID');
}

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    const sessionId = getSessionId(request);

    if (!decoded || !sessionId) {
      return NextResponse.json({ msg: 'Unauthorized', success: false }, { status: 401 });
    }

    const todos = await Todo.find({ sessionId, user: decoded.sub });
    return NextResponse.json({ msg: 'Found all todos', success: true, todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ msg: 'Issue happened' }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    const sessionId = getSessionId(request);

    if (!decoded || !sessionId) {
      return NextResponse.json({ msg: 'Unauthorized', success: false }, { status: 401 });
    }

    const reqBody = await request.json();
    const { desc } = reqBody;

    const { username, userId } = decoded;

    
    const newTodo = new Todo({
      id:v4(),
      user: userId,
      desc,
      completed: false,
      sessionId,
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
    const sessionId = getSessionId(request);

    if (!decoded || !sessionId) {
      return NextResponse.json({ msg: 'Unauthorized', success: false }, { status: 401 });
    }

    

    await Todo.deleteMany({});

    return NextResponse.json({ msg: 'Todo deleted', success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ msg: 'Issue happened' }, { status: 500 });
  }
}