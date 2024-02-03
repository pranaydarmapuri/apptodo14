// pages/api/todos.ts
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/db';
import Todo from '@/models/todo';
import { verifyToken } from '../../auth/tokenUtills';
import { v4 } from 'uuid';



connect();

function getIdFromPathname(s: String) {
  let parts = s.split('/');
  
  const id = parts[parts.length - 1];

  // Check if id is present and not equal to "undefined"
  if (id && id !== "undefined") {
    return id;
  } else {
    return null; // or handle the case when id is not present
  }
}


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

export async function PUT(request: NextRequest) {
  try {
    const decoded = verifyToken(request);

    if (!decoded) {
      return NextResponse.json({ msg: 'Unauthorized', success: false }, { status: 401 });
    }

    const path = request.nextUrl.pathname;
    const id = getIdFromPathname(path);

    const reqBody = await request.json();
    const { desc, completed } = reqBody;

    const updatedTodo = await Todo.findByIdAndUpdate(id, { desc, completed }, { new: true });

    if (!updatedTodo) {
      return NextResponse.json({ msg: 'Todo not found', success: false }, { status: 404 });
    }

    return NextResponse.json({ msg: 'Todo updated', success: true, updatedTodo });
  } catch (error) {
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

    const path = request.nextUrl.pathname;
    const id = getIdFromPathname(path);

    await Todo.deleteOne({ _id: id, sessionId, user: decoded.userId });

    return NextResponse.json({ msg: 'Todo deleted', success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ msg: 'Issue happened' }, { status: 500 });
  }
}