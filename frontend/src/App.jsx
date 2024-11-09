import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/common/SideBar'
import RightPanel from './components/common/RightPanel'
import SignUpPage from './pages/auth/signup/Signup'
import LoginPage from './pages/auth/login/Login'
import HomePage from './pages/home/Home'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
const App = () => {

	const {data:isauthenticated,isLoading} = useQuery({
    queryKey:["isauthenticated"],
	queryFn:async ()=>{
		try {
			const res = await axios.get("/api/auth/me")

			const data = res.data

			if(data.error){
				throw new Error(data.error)
			}

			return data
			

		} catch (error) {
			return null
		}
	},
	retry:false
	})

	
	
	return (
		<div className='flex max-w-6xl mx-auto'>
			{isauthenticated&&<Sidebar></Sidebar>}
			<Routes>
				<Route path='/' element={isauthenticated ? <HomePage /> :<Navigate to={"/login"}/>} />
				<Route path='/signup' element={!isauthenticated ?<SignUpPage />:<Navigate to={"/"}/>} />
				<Route path='/login' element={!isauthenticated?<LoginPage />:<Navigate to={"/"}/>} />
				<Route path='/notifications' element={isauthenticated?<NotificationPage/>:<Navigate to={"/login"}/>}/>
				<Route path="/profile/johndoe" element={isauthenticated?<ProfilePage/>:<Navigate to={"/login"}/>}/>
			</Routes>
			{isauthenticated&&<RightPanel></RightPanel>}
			<Toaster></Toaster>
		</div>
	);
	
}

export default App
