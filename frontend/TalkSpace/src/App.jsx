import React from 'react'
import Navbar from './components/navbar/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import {Loader} from 'lucide-react'
import HomePage from './components/homePage/HomePage';
import Signup from './components/signup/signup';
import Login from './components/login/login';
import { Toaster } from 'react-hot-toast';
import Settings from './components/settings/Settings';
import ProfilePage from './components/profilePage/ProfilePage';

function App() {
const {authUser,isCheckingAuth,checkAuth} = useAuthStore();
useEffect(() => {
  checkAuth();
}, [checkAuth]);
console.log({ authUser }); 

if (isCheckingAuth && !authUser) return(
  <div className='flex justify-center items-center h-screen w-full'>
    <Loader className='size-10 animate-spin' />
  </div>
 )

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser?<HomePage />: <Navigate to='/login'/>}/>,
        <Route path="/signup" element={!authUser?<Signup />: <Navigate to='/'/>} />,
        <Route path='/settings' element={<Settings/>}/>,
        <Route path='/profile' element={<ProfilePage/>}/>,
        <Route path="/login" element={!authUser?<Login />:<Navigate to='/'/>} />
      </Routes>
      
    <Toaster/>

    </div>
  )
}

export default App