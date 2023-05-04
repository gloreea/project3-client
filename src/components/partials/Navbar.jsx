import { Link } from 'react-router-dom'

export default function Navbar({ currentUser, handleLogout }) {
	const loggedIn = (
		<>
			{/* if the user is logged in... */}
			<Link to="/">
				<span onClick={handleLogout}><button>logout</button></span>
			</Link>
			<Link to="/profile">
			<button>profile</button>
			</Link>
			<Link to="/decks">
			<button>Your decks</button>
			</Link>
		
		</>
	)

	const loggedOut = (
		<>
			{/* if the user is not logged in... */}
			{/* <Link to="/register">
				<button>register</button>
			</Link>

			<Link to="/login">
			<button>login</button> */}
			{/* </Link> */}
			<Link to="/">
			<button>UserApp</button>
			</Link>
		</>
	)

	return (
		<nav>
			{/* user always sees this section */}
			{/* <Link to="/">
			<button>UserApp</button>
			</Link> */}

			{currentUser ? loggedIn : loggedOut}
		</nav>
	)
}