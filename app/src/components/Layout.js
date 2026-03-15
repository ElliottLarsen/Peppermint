import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {

    return (
        <>
        <header>
            <Navbar />
        </header>
        <main>
            <Outlet />
        </main>
        <Footer />
        </>
    )
}

export default Layout;
        