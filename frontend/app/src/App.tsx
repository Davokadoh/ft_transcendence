import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

function Copyright() {
	return (
		<Typography variant="body2" color="text.secondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://mui.com/">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}.
		</Typography>
	);
}

export default function App() {
	return (
		<>
			<Container maxWidth="sm">
				<Box>
					<Typography variant="h4" component="h1" gutterBottom>
						Material UI Vite.js example in TypeScript
					</Typography>
					<Copyright />
				</Box>
			</Container>
			<Container maxWidth="sm">
					<TextField id="outlined-basic" label="Ceci n'est pas du texte" variant="outlined" />
			</Container>
		</>
	);
}