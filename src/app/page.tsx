import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';



axios.defaults.baseURL = 'http://localhost:3000';

export default function Home() {
  return (
    <div className="container mt-5 bg-white p-3">
      <h1 className="mb-4">Todo App</h1>
      <br />
      <p className="lead">Get started by creating your todos.</p>
      <div className="row">
        <div className="col-md-4">
          <Link href="/todos">
            <button className="btn btn-primary">Create Todo</button>
          </Link>
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
