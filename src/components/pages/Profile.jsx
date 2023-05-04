import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Profile({ currentUser, handleLogout }) {
	// state for the secret message (aka user privilaged data)
	const [msg, setMsg] = useState('')
	const [email, setEmail] = useState(currentUser?.email)
	const [password, setPassword] = useState('*****')
	const [edit, setEdit] = useState(false)
	const navigate = useNavigate()

	// useEffect for getting the user data and checking auth
	useEffect(() => {
		const fetchData = async () => {
				try {
					// get the token from local storage
					const token = localStorage.getItem('jwt')
					// make the auth headers
					const options = {
						headers: {
							'Authorization': token
						}
					}
					// hit the auth locked endpoint
					const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/auth-locked`, options)
					// example POST with auth headers (options are always last argument)
					// await axios.post(url, requestBody (form data), options)
					// set the secret user message in state
					setMsg(response.data.msg)
				} catch (err) {
					// if the error is a 401 -- that means that auth failed
					console.warn(err)
					if (err.response) {
						if (err.response.status === 401) {
							// panic!
							handleLogout()
							// send the user to the login screen
							navigate('/login')
						}
					}
				}
			}
			fetchData()
	}, [handleLogout, navigate]) // only fire on the first render of this component

	useEffect(() => {
		setEmail(currentUser?.email)
	}, [currentUser])

	const handleEdit = () => {
		setEdit(true)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const token = localStorage.getItem('jwt')
      		const options = {
        		headers: {
          			'Authorization': token
        		}
      		}
			const requestBody = {
				email: email,
				password: password
			}
			await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/profile`, requestBody, options)
			setEdit(false)
		} catch (err) {
			console.warn(err)
		}
		// make api request to save and update 'email' and 'password' state 
	}
	const handleCancelClick = () =>{
		setEdit(false)
		// reset user info to original values
	}
	
	return (
		<div>
			<div>
				<h1>Hello, {currentUser?.name}</h1>

				<h2>Welcome to your Profile Page</h2>
			</div>
			<div className="user-stats">
				<h2>User Stats</h2>
				<p>Decks Studied: #</p>
				<p>Number of Decks: #</p>
			</div>

			<div>
				{edit ? ( 
					<>
					<form onSubmit={e => handleSubmit(e, email)}>
						<label htmlFor='email'>Email:</label>
						<input
							type="text"
							id="email"
							placeholder="enter new email"
							value={email}
							onChange={e => setEmail( e.target.value)} />
						<label htmlFor='password'>Password:</label>
						<input
							type="password"
							id="password"
							placeholder="enter new password"
							onChange={e => setPassword(e.target.value)} />
						<button onClick={handleSubmit}>Save</button>
						<button onClick={handleCancelClick}>Cancel</button>
					</form>
					</>
				):(
				<>
				<div className="user-info">
					<h2>User Information</h2>
					<p>Email : {currentUser?.email}</p>
					<p>Password : {password}</p>
					<button onClick={handleEdit}>Edit</button>
				</div>
				<h3>{msg}</h3>
				</>
				)}
			</div>
		</div>
		)
}
