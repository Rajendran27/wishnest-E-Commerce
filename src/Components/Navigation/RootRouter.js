import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'

const RootRouter = () => {

  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register", "/forgetpassword", "/seller-register"];

  return (
    <div>
        {!hideNavbarRoutes.includes(location.pathname.toLowerCase()) && <Navbar />}
        <Outlet/>
    </div>
  )
}

export default RootRouter