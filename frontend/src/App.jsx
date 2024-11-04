import React from 'react'
import Signup from './pages/auth/signup/Signup'
import Login from './pages/auth/login/Login'
import Home from './pages/home/Home'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/common/SideBar'
import RightPanel from './components/common/RightPanel'
import SignUpPage from './pages/auth/signup/Signup'
import LoginPage from './pages/auth/login/Login'
import HomePage from './pages/home/Home'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
const App = () => {

	return (
		<div className='flex max-w-6xl mx-auto'>
			<Sidebar></Sidebar>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/notifications' element={<NotificationPage/>}/>
				<Route path="/profile/johndoe" element={<ProfilePage/>}/>
			</Routes>
			<RightPanel></RightPanel>
		</div>
	);
}

export default App
