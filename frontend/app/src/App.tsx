import React from 'react';
import { CSSProperties } from 'react';
import '@picocss/pico'
import '/src/stylesheet.css'; //font Spoof styles

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
	margin: 'auto',
	color: '#9016B2'
};

const titanOneFontStyles: CSSProperties = {
	fontFamily: 'Titan One, cursive', // Use 'Titan One' font
	fontWeight: 'normal', // Make it regular (not bold)
	color: 'var(--vert)', // #87D300 variable dans index.html
};

const spoofBoldFontStyle: CSSProperties = {
	fontFamily: 'Spoof, sans-serif',
	fontWeight: 'bold', // Make it regular (not bold)
	color: '#00BAB9'
};

// Renders a card form asking email and password, or login via 42 or Google
function LoginPage() {
	return (
		<article className="grid" style={articleStyle}>
			<div>
				<hgroup>
				<h1 className="titan-one-font" style={titanOneFontStyles}>Welcome to the Pong-chos website ! </h1>
					<h2 className='Spoof Bold' style={spoofBoldFontStyle}>A 42 project : Transcendence</h2>
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
					<button className="spoof-bold-button" style={{
						...buttonStyle, 
						gridColumn: '1', 
						backgroundColor: '#87D300',
						border: '2px solid #ffffff',
						}}>42</button>
					<button className="spoof-bold-button" style={{ ...buttonStyle, 
						gridColumn: '2',
						backgroundColor: '#87D300',
						border: '2px #FFFFFF'
						}}>Google</button>
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

// function Spoof() {
// 	return (
// 		<div style={spoofBoldFontStyle}>
// 			<p>This text uses your custom font.</p>
// 		</div>
// 	);
// }