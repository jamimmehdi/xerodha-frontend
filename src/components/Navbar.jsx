import { Avatar, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { removeUser } from '../helper/UserSlice';

const pages = ['Dashboard', 'Holdings', 'Transactions'];

function Navbar() {
    const { name } = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const logout = () => dispatch(removeUser());

    const handleHomeNavigation = () => {
        navigate('/');
    }

    return (
        <Stack justifyContent="space-between" direction="row" weight="100%" height="4rem" alignItems="center" px="1rem">
            <Stack direction="row" alignItems="center" spacing={0.5} onClick={handleHomeNavigation} sx={{ cursor: "pointer" }}>
                <Typography fontWeight="700" fontSize="1.5rem" color="#e74c3c">xerodha</Typography>
                <Typography fontWeight="400" fontSize="small" color="#e74c3c">international</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={3} >
                {pages && pages.map((page, index) => (
                    <Typography key={index} onClick={() => navigate(`/${page.toLowerCase()}`)} fontSize="0.8rem" color={pathname.split("/")[1] === page.toLocaleLowerCase() && "#e74c3c"} sx={{ '&:hover': { color: "#e74c3c", cursor: 'pointer' } }}>{page}</Typography>
                ))}
                <Divider orientation="vertical" variant="middle" flexItem />
                <Avatar sx={{ width: 25, height: 25 }} alt={name} src="/static/images/avatar/1.jpg" />
                <Typography fontSize="0.8rem" textTransform="uppercase" color="#bdc3c7"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick} sx={{ cursor: "pointer" }}>{name && name}</Typography>
                <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
            </Stack>
        </Stack>
    );
}
export default Navbar;

