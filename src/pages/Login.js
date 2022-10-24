import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setUser } from '../helper/UserSlice';
import { loginUser } from '../utils/Services/APICall';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const dispatch = useDispatch();

    const isValid = username && password ? true : false;

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleLogin = async () => {
        setLoading(true);

        const credential = {
            user_id: username,
            password: password
        }

        const data = await loginUser(credential, setLoading);

        if (data.status === 'FAILED') {
            setLoginError(true);
            return;
        }

        dispatch(setUser(data.data));
    }

    return (
        <Stack spacing={5} bgcolor="f9f9f9" direction="column" width="100%" minHeight="100vh" alignItems="center" justifyContent="center">
            <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography fontWeight="700" fontSize="1.5rem" color="#e74c3c">xerodha</Typography>
                <Typography fontWeight="400" fontSize="small" color="#e74c3c">international</Typography>
            </Stack>
            <Typography fontWeight="bold">Login</Typography>
            <Stack direction="column" minWidth="300px" spacing={3}>
                <TextField fullWidth label="username" id="fullWidth" size='small' value={username} onChange={handleUsernameChange} />
                <TextField fullWidth label="password" id="fullWidth" size='small' value={password} onChange={handlePasswordChange} />
                <Button onClick={handleLogin} variant="outlined" disabled={isValid && !loading ? false : true}>{!loading ? 'Login' : <CircularProgress size="1.5rem" />}</Button>
                {loginError && <Typography fontSize="small" color="red">Wrong username/password combination!</Typography>}
            </Stack>
            <Typography fontSize="small">Not registered? <Link to={'/register'}>Sign UP</Link></Typography>
        </Stack>
    )
}
