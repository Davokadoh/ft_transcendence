import React from 'react';
import { CSSProperties } from 'react';
import '@picocss/pico'

const articleStyle: CSSProperties = {
	width: '50%',
	height: '50%',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
};

const buttonStyle: CSSProperties = {
	width: '6rem',
	margin: 'auto'
};

// Renders a card form asking email and password, or login via 42 or Google
function LoginPage() {
	return (
		<article className="grid" style={articleStyle}>
			<div>
				<hgroup>
					<h1>Sign in</h1>
					<h2>A minimalist layout for Login pages</h2>
				</hgroup>
				<form>
					<input
						type="email"
						name="email"
						placeholder="Email"
						aria-label="Email"
						autoComplete="email"
						required
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						aria-label="Password"
						autoComplete="current-password"
						required
					/>
					<button type="submit" className="contrast" onClick="event.preventDefault()">Login</button>
				</form>
				<progress value="0" max="100"></progress>
				<div className='grid'>
					<button style={{ ...buttonStyle, gridColumn: '1' }}>42</button>
					<button style={{ ...buttonStyle, gridColumn: '2' }}>Google</button>
				</div>
			</div>
		</article>
	);
}

function HomePage() {
	return (
		<div>
			Home Page
		</div>
	);
}

// Renders login page if user not logged in, otherwise renders home page
export default function App() {
	const logged = false;
	return (
		<div className='container'>
			{logged ? <HomePage /> : <LoginPage />}
		</div>
	);
}