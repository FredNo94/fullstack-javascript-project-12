import './App.css';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="d-flex flex-column h-100">
      <header className="shadow-sm bg-white">
        <div className="container py-3">
          <Link to="/" className="text-decoration-none fw-bold">
            Hexlet Chat
          </Link>
        </div>
      </header>
      <main className="flex-grow-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
