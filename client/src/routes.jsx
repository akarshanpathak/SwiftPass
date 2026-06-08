import React from 'react'
import {Route,BrowserRouter,Routes} from "react-router-dom"
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import MainLayout from './layout/MainLayout'
import AuthLayout from './layout/AuthLayout'
import EventDetails from './components/EventDetails'
import PaymentSuccess from './components/PaymentSuccess'
import Profile from './pages/Profile'
import CreateEvent from './pages/CreateEvent'
import Ticket from './pages/Ticket'
import Wishlist from './components/Wishlist'
import NotFound from './pages/NotFound'

function routes() {
  return (
    <div>
      <BrowserRouter>
            <Routes>
              <Route element={<AuthLayout/>}>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
              </Route>
            
              <Route element={<MainLayout/>}>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/about" element={<About/>}/>
                  <Route path="/eventDetails/:id" element={<EventDetails/>}/>
                  <Route path="/payment-success" element={<PaymentSuccess/>}/>
                  <Route path="/profile" element={<Profile/>}/>
                  <Route path="/create-event" element={<CreateEvent/>}/>
                  <Route path="/ticket" element={<Ticket/>}/>
                  <Route path="/wishlist" element={<Wishlist/>}/>
                  
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            
      </BrowserRouter>
    </div>
  )
}

export default routes

