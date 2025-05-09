import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    }, [navigate, setIsLoggedIn]);
    
    return null;
};

export default Logout;