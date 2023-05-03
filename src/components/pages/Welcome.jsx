export default function Welcome() {
	return (
		<div>
			<h1> Welcome to Card.io</h1>
			<h2> A flashcard app</h2>
			<form action = "/login">
				<button type="submit">Log in</button>
			</form>
			<form action = "/register">
				<button type="submit">Register</button>
			</form>
		</div>
	)
}