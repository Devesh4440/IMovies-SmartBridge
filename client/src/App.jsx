import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';

// Lazy load route components for lightning-fast performance and code splitting
const Register = lazy(() => import('./Register'));
const Login = lazy(() => import('./Login'));
const Dashboard = lazy(() => import('./Dashboard'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const AdminAddMovie = lazy(() => import('./AdminAddMovie'));
const AdminAddShow = lazy(() => import('./AdminAddShow'));
const BookTicket = lazy(() => import('./BookTicket'));
const MyBookings = lazy(() => import('./MyBookings'));
const MovieReviews = lazy(() => import('./MovieReviews'));
const Watchlist = lazy(() => import('./Watchlist'));

// Cyberpunk Loading Skeleton Fallback Component
function CyberLoader() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
            <div style={{ 
                width: '50px', 
                height: '50px', 
                border: '3px solid var(--border-color)', 
                borderTop: '3px solid var(--cyan-glow)', 
                borderRadius: '50%', 
                animation: 'spin 0.8s linear infinite' 
            }}></div>
            <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--cyan-glow)', letterSpacing: '2px', fontSize: '14px' }}>
                INITIALIZING NEO-TOKYO MATRIX...
            </p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function Navigation() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setUser(decoded);
            } catch (err) {
                console.error("Invalid token", err);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="brand-logo">i<span>MOVIES</span></Link>
            
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/dashboard" className="nav-link">Movies</Link>
                
                {user && (
                    <>
                        <Link to="/book" className="nav-link">Book Ticket</Link>
                        <Link to="/my-bookings" className="nav-link">My Orders</Link>
                        <Link to="/watchlist" className="nav-link">Watchlist</Link>
                    </>
                )}

                {user?.role === 'admin' && (
                    <>
                        <span style={{ color: 'var(--border-color)' }}>|</span>
                        <Link to="/admin" className="nav-link nav-link-admin">Admin Dashboard</Link>
                    </>
                )}
            </div>

            <div className="nav-links">
                {user ? (
                    <>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Hi, <strong>{user.username}</strong></span>
                        <button onClick={handleLogout} className="btn-danger" style={{ padding: '6px 12px' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', textDecoration: 'none' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />

        {/* Suspense handles the lazy-loaded route chunks with a smooth cyberpunk loader */}
        <Suspense fallback={<CyberLoader />}>
          <Routes>
            <Route path="/" element={
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
                  Movie Ticket Booking Made Simple.
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '500px', margin: '0 auto 30px auto' }}>
                  Browse upcoming shows, pick your favorite seats in real-time, and manage reservations seamlessly.
                </p>
                <Link to="/dashboard" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '14px 28px', textDecoration: 'none' }}>
                  Browse Movies Now
                </Link>
              </div>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/book" element={<BookTicket />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/reviews/:movieId" element={<MovieReviews />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add-movie" element={<AdminAddMovie />} />
            <Route path="/admin/add-show" element={<AdminAddShow />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;