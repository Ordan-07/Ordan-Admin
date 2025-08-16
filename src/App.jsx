import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddHero from './pages/AddHero';
import HeroList from './pages/HeroList';
import Settings from './pages/Settings';
import VideoSettings from './pages/VideoSettings';
import EmailManagement from './pages/EmailManagement';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/add-hero' element={<AddHero token={token} />} />
                <Route path='/hero-list' element={<HeroList token={token} />} />
                <Route path='/settings' element={<Settings token={token} />} />
                <Route path='/video-settings' element={<VideoSettings token={token} />} />
                <Route path='/email-management' element={<EmailManagement token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App