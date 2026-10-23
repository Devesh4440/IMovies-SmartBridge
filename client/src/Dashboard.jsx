import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [movies, setMovies] = useState([]);
    const [watchlistIds, setWatchlistIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchMoviesAndWatchlist = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/movies');
            setMovies(res.data);

            const token = localStorage.getItem('token');
            if (token) {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const wlRes = await axios.get(`http://localhost:8000/api/watchlist/user/${tokenData.id}`);
                setWatchlistIds(wlRes.data.map(m => m._id));
            }
        } catch (err) {
            console.error("Error fetching movies or watchlist", err);
        }
    };

    useEffect(() => {
        fetchMoviesAndWatchlist();
    }, []);

    const toggleWatchlist = async (movieId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to save movies to your watchlist.');
            return;
        }

        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const isSaved = watchlistIds.includes(movieId);

            if (isSaved) {
                await axios.post('http://localhost:8000/api/watchlist/remove', {
                    userId: tokenData.id,
                    movieId
                });
            } else {
                await axios.post('http://localhost:8000/api/watchlist/add', {
                    userId: tokenData.id,
                    movieId
                });
            }

            fetchMoviesAndWatchlist();
        } catch (err) {
            console.error("Watchlist error", err);
        }
    };

    // Filter movies based on cyber search input
    const filteredMovies = movies.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.language.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Cyberpunk Matrix Banner */}
            <div style={{ 
                background: 'linear-gradient(135deg, rgba(255, 0, 85, 0.08), rgba(0, 243, 255, 0.08))', 
                border: '1px solid var(--border-color)', 
                borderRadius: '16px', 
                padding: '32px', 
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '120px', opacity: '0.03', fontFamily: 'var(--font-heading)' }}>
                    IMOVIES
                </div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', margin: '0 0 8px 0', color: 'var(--text-main)' }}>
                    // ACTIVE CINEMA MATRIX
                </h1>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 20px 0', fontSize: '15px' }}>
                    Select a feature screening, reserve seats in real-time, and synchronize your watchlist.
                </p>
                
                {/* Search Input Bar */}
                <div style={{ maxWidth: '400px' }}>
                    <input 
                        type="text" 
                        placeholder="Search by title, genre, or language..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: '#070913', borderColor: 'var(--border-color)' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '18px', letterSpacing: '1px' }}>
                    FEATURED RELEASES ({filteredMovies.length})
                </h3>
            </div>

            <div className="card-grid">
                {filteredMovies.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        No movies matching query parameters.
                    </p>
                ) : null}
                
                {filteredMovies.map((movie) => {
                    const isBookmarked = watchlistIds.includes(movie._id);
                    return (
                        <div key={movie._id} className="movie-card">
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h3 style={{ margin: 0 }}>{movie.title}</h3>
                                    <button 
                                        onClick={() => toggleWatchlist(movie._id)}
                                        style={{ 
                                            background: 'none', 
                                            border: 'none', 
                                            color: isBookmarked ? 'var(--primary)' : 'var(--text-muted)', 
                                            fontSize: '22px', 
                                            cursor: 'pointer',
                                            padding: 0,
                                            transition: 'transform 0.2s ease'
                                        }}
                                        title={isBookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
                                    >
                                        {isBookmarked ? '♥' : '♡'}
                                    </button>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <span className="badge">{movie.genre}</span>
                                    <span className="badge">{movie.language}</span>
                                    <span className="badge" style={{ borderColor: 'rgba(255, 204, 0, 0.3)', color: '#ffcc00', background: 'rgba(255, 204, 0, 0.08)' }}>
                                        ⭐ {movie.rating || '4.5'}
                                    </span>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
                                    {movie.description || 'Experience this feature film in theaters near you with immersive high-definition surround sound.'}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                <button 
                                    onClick={() => navigate(`/book?movieId=${movie._id}`)}
                                    className="btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    Book Seat
                                </button>
                                <button 
                                    onClick={() => navigate(`/reviews/${movie._id}`)}
                                    className="btn-danger"
                                    style={{ flex: 1, backgroundColor: '#111526', color: 'var(--cyan-glow)', borderColor: 'var(--border-color)' }}
                                >
                                    Reviews
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Dashboard;