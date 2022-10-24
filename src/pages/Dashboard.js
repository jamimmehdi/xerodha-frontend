import { Divider, Skeleton, Typography, useMediaQuery } from '@mui/material'
import { Box, Stack } from '@mui/system'
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OpacityIcon from '@mui/icons-material/Opacity';
import { Outlet } from 'react-router-dom';
import WatchlistItem from '../components/WatchlistItem';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import { getUserbalance, updateBalance } from '../utils/Services/APICall';
import { updateUserBalance } from '../helper/UserSlice';

const Equity = ({ user_id }) => {
    const balance = useSelector((state) => state.user.user_balance);
    const [loading, setLoading] = useState(false);
    const [balanceError, setBalanceError] = useState(false);
    const dispatch = useDispatch();

    // Get balance
    const getBalance = async (user_id) => {
        const data = await getUserbalance(user_id, setLoading);

        if (data.status === 'FAILED') {
            setBalanceError(true);
            return;
        }

        dispatch(updateUserBalance({ ...data.data }));
    }

    useEffect(() => {
        if (user_id) {
            setLoading(true);
            getBalance(user_id);
        };
    }, [])

    return (
        !balanceError ? <Stack direction="column">
            <Stack direction="row" alignItems="center" spacing={2}>
                <PieChartOutlineIcon variant="h5" style={{ color: "#44444a" }} />
                <Typography variant="h5" component="h5" color="#44444a">Equity</Typography>
            </Stack>

            <Stack direction="row" mt="1rem" spacing={3}>
                <Stack direction="column" spacing={loading ? 2 : 0}>
                    {!loading ? <Typography fontSize="xxx-large" fontWeight="300" color="#44444a">{balance && balance.margin_available.toFixed(2)}</Typography> :
                        <Skeleton variant="rectangular" width={210} height={30} />}
                    {!loading ? <Typography fontSize="small" color="#9b9b9b">Margin available</Typography> :
                        <Skeleton variant="rectangular" width={100} height={15} />}
                </Stack>

                <Divider orientation="vertical" flexItem />

                <Stack direction="column" justifyContent="space-between" spacing={loading ? 2 : 0}>
                    {!loading ?
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography fontSize="small" color="#9b9b9b">Margin used</Typography>
                            <Typography fontWeight="300" color="#44444a" fontSize="large">{balance && balance.margin_used}</Typography>
                        </Stack> :
                        <Skeleton variant="rectangular" width={200} height={20} />}

                    {!loading ? <Stack direction="row" spacing={2} alignItems="center">
                        <Typography fontSize="small" color="#9b9b9b">Opening balance</Typography>
                        <Typography fontWeight="300" color="#44444a" fontSize="large">{balance && balance.opening_balance}</Typography>
                    </Stack> :
                        <Skeleton variant="rectangular" width={200} height={20} />}

                    {!loading ? <Stack direction="row" spacing={1} alignItems="center" style={{ cursor: "pointer" }}>
                        <VisibilityIcon fontSize="x-small" style={{ color: "#3498db" }} />
                        <Typography fontSize="small" color="#3498db">View Statement</Typography>
                    </Stack> :
                        <Skeleton variant="rectangular" width={100} height={20} />}
                </Stack>
            </Stack>
        </Stack> : "Error loading balance"
    )
}

const Commodity = () => {
    return (
        <Stack direction="column">
            <Stack direction="row" alignItems="center" spacing={2}>
                <OpacityIcon variant="h5" style={{ color: "#44444a" }} />
                <Typography variant="h5" component="h5" color="#44444a">Commodity</Typography>
            </Stack>

            <Stack direction="row" mt="1rem" spacing={3}>
                <Stack direction="column">
                    <Typography fontSize="xxx-large" fontWeight="300" color="#44444a">0.8</Typography>
                    <Typography fontSize="small" color="#9b9b9b">Margin available</Typography>
                </Stack>

                <Divider orientation="vertical" flexItem />

                <Stack direction="column" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography fontSize="small" color="#9b9b9b">Margin available</Typography>
                        <Typography fontWeight="300" color="#44444a" fontSize="large">0</Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography fontSize="small" color="#9b9b9b">Opening balance</Typography>
                        <Typography fontWeight="300" color="#44444a" fontSize="large">0.8</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center" style={{ cursor: "pointer" }}>
                        <VisibilityIcon fontSize="x-small" style={{ color: "#3498db" }} />
                        <Typography fontSize="small" color="#3498db">View Statement</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default function Dashboard() {
    const isLargerThan600 = useMediaQuery('(min-width:600px)');
    const { name, _id, watchlist } = useSelector((state) => state.user.user);

    return (
        <Stack width="100%">
            <Typography variant="h4" component="h4" color="#444444" py="1rem">{`Hi, ${name}`}</Typography>

            <Divider light />

            <Stack direction={isLargerThan600 ? "row" : "column"} py="2rem" spacing="10%">
                <Equity user_id={_id} />
                <Commodity />
            </Stack>

            <Divider light />
            <Stack direction="row" spacing={3} mt="2rem">
                <Stack direction="column" width="40%" maxWidth={350}>
                    <Typography fontWeight="bold">Watchlist</Typography>
                    {watchlist.length > 0 && watchlist.map((instrument) => (
                        <WatchlistItem key={instrument} symbol={instrument} />
                    ))}
                </Stack>
                <Stack direction="column" width="60%" minHeight="700px">
                    <Outlet />
                </Stack>
            </Stack>
        </Stack>
    )
}
