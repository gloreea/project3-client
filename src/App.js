import {
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/pages/Login'
import Profile from './components/pages/Profile'
import Register from './components/pages/Register'
import Welcome from './components/pages/Welcome'
import Navbar from './components/partials/Navbar'
import Deck from './components/pages/Deck'
import Decks from './components/pages/Decks'
import NotFound from './components/pages/NotFound'
import StudyMode from './components/pages/StudyMode'
import './App.css'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

function App() {
	// the currently logged in user will be stored up here in state
	const [currentUser, setCurrentUser] = useState(null)
	
	// useEffect -- if the user navigates away form the page, we will log them back in
	useEffect(() => {
		// check to see if token is in storage
		const token = localStorage.getItem('jwt')
		if (token) {
			// if so, we will decode it and set the user in app state
			setCurrentUser(jwt_decode(token))
		} else {
			setCurrentUser(null)
		}
	}, []) // happen only once

	// event handler to log the user out when needed
	const handleLogout = () => {
		// check to see if a token exists in local storage
		if (localStorage.getItem('jwt')) {
			// if so, delete it
			localStorage.removeItem('jwt')
			// set the user in the App state to be null
			setCurrentUser(null)
		}
	}

	const updateScore = async (userId, points) => {
		try {
			const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/update-score/${userId}`, { points })
			setCurrentUser(response.data)
		} catch (err) {
			console.log('error updating score: ', err)
		}
	}

	return (
		<Router>
			<header>
				<Navbar
					currentUser={currentUser}
					handleLogout={handleLogout}
				/>
			</header>

			<div className="App">
				<Routes>
					<Route
						path="/"
						element={<Welcome />}
					/>

					<Route
						path="/register"
						element={<Register currentUser={currentUser} setCurrentUser={setCurrentUser} />}
					/>

					<Route
						path="/login"
						element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser} />}
					/>

					<Route
						path="/profile"
						element={<Profile handleLogout={handleLogout} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
					/>
					<Route
						path="/decks"
						element={<Decks />}
					/>
					<Route
						path="/decks/:id"
						element={<Deck />}
					/>
					<Route
						path="/decks/:id/studymode"
						element={<StudyMode updateScore={updateScore} />}
					/>
					<Route
            			path='*'
            			element={<NotFound />}
          			/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
