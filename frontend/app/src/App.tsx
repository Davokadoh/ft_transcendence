import { CSSProperties } from 'react';
import '@picocss/pico'
import {config} from 'dotenv'

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
					<button type="submit" className="contrast">Login</button>
				</form>
				<progress value="0" max="100"></progress>
				<div className='grid'>
					<a href={`https://api.intra.42.fr/oauth/authorize?client_id=${import.meta.env.VITE_FT_CLIENT_ID}&redirect_uri=http%3A%2F%2F127.0.0.1%3A5173&response_type=code`} target="_blank" rel="noreferrer">
						<button style={{ ...buttonStyle, gridColumn: '1' }}>42</button>
					</a>
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