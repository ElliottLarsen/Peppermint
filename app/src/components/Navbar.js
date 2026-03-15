import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { isLoggedIn, logout } = useAuth();

    return (
        <div className="navbar">
            <div>
                <h1 className="name">
                    <Link to={isLoggedIn ? "/home" : "/"}>
                    Peppermint
                    </Link>
                </h1>
                
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
                        {/* <Link to="/">Home</Link> */}
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                        </>
                    )}
                </nav>
            </div>
        </div>
    )
};

export default Navbar;