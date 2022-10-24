import { Button, CircularProgress, FormControl, FormHelperText, Input, InputLabel, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setUser } from '../helper/UserSlice';
import { registerUser } from '../utils/Services/APICall';

export default function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [registrationError, setRregistrationError] = useState(false);
    const dispatch = useDispatch();

    const isValidEmail = email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    const isValid = username.length > 3 && password.length >= 5 && isValidEmail && name.length > 3 ? true : false;

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleNameChange = (e) => setName(e.target.value);

    const handleRegister = async () => {
        setLoading(true);

        const credential = {
            username: username,
            name: name,
            email: email,
            password: password
        };

        const data = await registerUser(credential, setLoading);

        if (data.status === 'FAILED') {
            setRregistrationError(true);
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
            <Typography fontWeight="bold">Register</Typography>

            <Stack direction="column" minWidth="300px" spacing={3}>
                <TextField fullWidth label="full name" id="fullWidth" size='small' value={name} onChange={handleNameChange} />
                <TextField fullWidth label="username" id="fullWidth" size='small' value={username} onChange={handleUsernameChange} />
                <TextField fullWidth label="email" id="fullWidth" size='small' value={email} onChange={handleEmailChange} />
                <TextField fullWidth label="password" id="fullWidth" size='small' value={password} onChange={handlePasswordChange} />
                <Button onClick={handleRegister} variant="outlined" disabled={isValid && !loading ? false : true}>{!loading ? 'Register' : <CircularProgress size="1.5rem" />}</Button>
                {registrationError && <Typography fontSize="small" color="red">Opps! Error Registering user.</Typography>}
            </Stack>
            <Typography fontSize="small">Already Registered? <Link to={'/login'}>Login</Link></Typography>
        </Stack>
    )
}
