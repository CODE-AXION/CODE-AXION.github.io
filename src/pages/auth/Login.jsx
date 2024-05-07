import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/auth'
import AuthSessionStatus from '../../components/Auth/AuthSessionStatus'
import AuthValidationErrors from '../../components/Auth/AuthValidationErrors'
import { NavLink } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';


import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../stores/ui/loadingSlice';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn({ handleLoadingChange }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])
  const [status, setStatus] = useState(null)

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  // const [isLoading, setIsLoading] = useState(false)

  // let isLogg
  // useEffect(() => {
  //   handleLoadingChange(true); // Call handleLoadingChange once after component mounts
  // }, [])


  const { user, isLoading, login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/'
  })

  const dispatch = useDispatch();

  // console.log(isLoading)
  // useEffect(() => {
  //   // console.log(isLoading)
  //   // dispatch(setLoading(isLoading));
  // }, [isLoading]);
  if (isLoggedIn || (isLoggedIn == null)) return null;





  const submitForm = async event => {
    event.preventDefault()
    login({ email, password, setErrors, setStatus })
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={submitForm} noValidate sx={{ mt: 1 }}>
            {/* Session Status */}
            <AuthSessionStatus className="mb-4" status={status} />
            {/* Validation Errors */}
            <AuthValidationErrors className="mb-4" errors={errors} />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              value={email}
              onChange={event => setEmail(event.target.value)}
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}