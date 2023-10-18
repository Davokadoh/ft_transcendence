import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import SignIn from './SignIn';

import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: prefersDarkMode ? 'dark' : 'light',
				},
			}),
		[prefersDarkMode],
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<SignIn></SignIn>
		</ThemeProvider>
		// <Container maxWidth="sm">
		//   <Box sx={{ my: 4 }}>
		//     <Typography variant="h4" component="h1" gutterBottom>
		//       Material UI Vite.js example in TypeScript
		//     </Typography>
		//     <ProTip />
		//     <Copyright />
		//   </Box>
		// </Container>
	);
}
