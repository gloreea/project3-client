import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faHouse, faList } from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ currentUser, handleLogout }) {
	const loggedIn = (
		<>
			{/* if the user is logged in... */}
			<Link to="/">
				<span onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} />
					Logout</span>
			</Link>
			<Link to="/profile">
				<FontAwesomeIcon icon={faUser} />
				Profile
			</Link>
			<Link to="/decks">
				<FontAwesomeIcon icon={faList} />
				Your Decks
			</Link>

		</>
	)

	const loggedOut = (
		<>
			{/* if the user is not logged in... */}

			<Link to="/">
				<FontAwesomeIcon icon={faHouse} />
				Home
			</Link>
		</>
	)

	return (
		<nav className="navbar">
			{/* user always sees this section */}
			{/* <Link to="/">
			<button>UserApp</button>
			</Link> */}

			{currentUser ? loggedIn : loggedOut}
		</nav>
	)
}