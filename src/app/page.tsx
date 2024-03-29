'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../useAuth';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    
    if (isAuthenticated) {
      router.push('/todos');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container mt-5 bg-white p-3">
      <h1 className="mb-4">Todo App</h1>
      <br />
      <p className="lead">Get started by creating your todos.</p>
      <div className="row">
        <div className="col-md-4">
          <button className="btn btn-primary" onClick={() => router.push('/todos')}>
            Create Todo
          </button>
        </div>
        <div className="col-md-4">
          <Link href="/signin">
            <button className="btn btn-success">Sign In</button>
          </Link>
        </div>
        <div className="col-md-4">
          <Link href="/login">
            <button className="btn btn-info">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
