import React from 'react'
import Signup from './pages/auth/signup/Signup'
import Login from './pages/auth/login/Login'
import Home from './pages/home/Home'
import { Route, Routes } from 'react-router-dom'
const App = () => {
  return (
    <div className='flex max-w-6xl mx-auto'>
       <Routes>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<Home/>} />
      </Routes>
  
    </div>
  )
}

export default App
