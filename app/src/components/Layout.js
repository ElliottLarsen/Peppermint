import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const year = new Date().getFullYear();

const Layout = () => {
    const { isLoggedIn, logout } = useAuth();

    return (
        <>
        <header>
            <div className="navbar">
                <div>
                    <h1>Peppermint</h1>
                </div>
                <div>
                    <nav>
                        {isLoggedIn ? (
                            <>
                            <Link to="/home">Home</Link>
                            <Link to="/accounts">Accounts</Link>
                            <Link to="/transactions">Transactions</Link>
                            <Link to="/budgets">Budgets</Link>
                            <Link to='/user'>Profile</Link>
                            <button
                                className="logout-btn"
                                onClick={logout}>
                                Logout
                            </button>
                            </>
                        ) : (
                            <>
                            <Link to="/">Home</Link>
                            <Link to="/register">Register</Link>
                            <Link to="/login">Login</Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
        <main>
            <Outlet />
        </main>
        <footer>
            <p>&copy; {year}</p>
        </footer>
        </>
    )
}

export default Layout;
        