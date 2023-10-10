import React, { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'

const Nav = () => {
    const auth = localStorage.getItem('user');
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/sighup')
    }
    return (
        <div>
            <img className='logo' src="myphoto.jpg" alt="logo" />
            {auth ? <ul className="nav-ul">
                <li><Link to="/">Products</Link></li>
                <li><Link to="/add">Add Product</Link></li>
                <li><Link to="/update">Update Product</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                {/* <li>{auth ? <Link onClick={logout} to="/sighup">Logout</Link> :
                    <Link to="/sighup">sign Up</Link>}</li>
                <li><Link to="/login">Login</Link></li> */}
                <li><Link onClick={logout} to="/sighup">Logout ({JSON.parse(auth).name})</Link></li>

            </ul>
                :
                <ul className="nav-ul nav-right">
                    <li> <Link to="/sighup">sign Up</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            }
        </div>
    )
}

export default Nav

