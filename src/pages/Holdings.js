import { Box, Divider, LinearProgress, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Holdingstable from '../components/HoldingTable'
import { getHoldings } from '../utils/Services/APICall';

export default function Holdings() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [holdingError, setHoldingError] = useState(false);
    const { _id } = useSelector((state) => state.user.user);


    // Get all holdings for the user
    const getHoldingsData = async (user_id) => {
        const data = await getHoldings(user_id, setLoading);

        if (data.status === 'FAILED') {
            setHoldingError(true);
            return;
        }

        setData([...data.data]);
    }

    useEffect(() => {
        setLoading(true);
        getHoldingsData(_id);
    }, [])
    return (
        <Stack direction="column" width="100%" spacing={2}>
            <Typography fontSize="xx-large">Holdings</Typography>
            <Divider orientation="horizontal" flexItem />
            {loading && <Box sx={{ width: '100%', }}>
                <LinearProgress sx={{ "& .MuiLinearProgress-barColorPrimary": { backgroundColor: "#ff5722" }, bgcolor: "white" }} />
            </Box>}
            <Holdingstable data={data} />
        </Stack>
    )
}
