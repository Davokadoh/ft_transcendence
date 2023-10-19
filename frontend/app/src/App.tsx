import React from 'react';
import { CSSProperties } from 'react';
import './App.css';

type SeparatorProps = {
	color?: string;
	thickness?: number;
};

function Separator(props: SeparatorProps) {
	const { color = 'black', thickness = 0.1 } = props;

	const separatorStyle = {
		width: '90%',
		height: `${thickness}em`,
		backgroundColor: color,
		margin: '1rem 0',
	};

	return <div style={separatorStyle} />;
}

type CardProps = {
	children: React.ReactNode;
};

function Card(props: CardProps) {
	const cardStyle: CSSProperties & { flexDirection: string } = {
		backgroundColor: 'navy',
		width: '32vw',
		height: '42vh',
		borderRadius: '42px',
		// position: 'absolute',
		// transform: 'translate(-50%, -50%)',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	};

	return (
		<div style={cardStyle}>
			{props.children}
		</div>
	);
}

// Renders a card form asking email and password, or login via 42 or Google
function LoginPage() {
	return (
		<Card>
			<form>
				<label htmlFor="mail">Email:</label>
				<input type="email" placeholder="Email" />
				<label htmlFor="password">Password:</label>
				<input type="password" placeholder="Password" />
				<button type="submit">Login</button>
			</form>
			<Separator />
			<div>
				<button>42</button>
				<button>Google</button>
			</div>
		</Card>
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
		<div>
			{logged ? <HomePage /> : <LoginPage />}
		</div>
	);
}