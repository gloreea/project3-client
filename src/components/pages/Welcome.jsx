export default function Welcome() {
	return (
		<div className="landing-page">
      		<header>
        		<h1>Welcome to Card.io!</h1>
        		<p>A fun and interactive flashcard app to learn and revise.</p>
      		</header>
		<main>
			<section className="features">
			<h2>Key Features</h2>
			<ul>
				<li>Create custom flashcards</li>
				<li>Organize flashcards into decks</li>
				<li>Track your progress and performance</li>
			</ul>
			</section>
        <section className="how-to-get-started">
          <h2>How to Get Started</h2>
          <ol>
            <li>Sign up or log in to your account.</li>
            <li>Create your own flashcards or choose from existing decks.</li>
            <li>Start studying and mastering your subjects!</li>
          </ol>
        </section>
        <section className="new-user">
          <h2>Ready to Get Started?</h2>
          <p>Click 	Below!</p>
          <button>Register</button>
        </section>
        <section className="existing-user">
          <h2>Returning User?</h2>
          <p>Click 	Below!</p>
          <button>Log in</button>
        </section>
      </main>
    </div>
  );
};


