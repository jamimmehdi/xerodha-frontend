import { Box, Divider, LinearProgress, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import PurchaseTable from '../components/PurchaseTable';
import SoldTable from '../components/SoldTable';
import { getPurchase, getSold } from '../utils/Services/APICall';

export default function Transactions() {
    const [purchaseData, setPurchaseData] = useState([]);
    const [soldData, setSoldData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [purchaseError, setPurchaseError] = useState(false);
    const [soldError, setSoldError] = useState(false);
    const { _id } = useSelector((state) => state.user.user);


    // Get all purchase for the user
    const getPurchaseData = async (user_id) => {
        const data = await getPurchase(user_id, setLoading);

        if (data.status === 'FAILED') {
            setPurchaseError(true);
            return;
        }

        setPurchaseData([...data.data]);
    }

    // Get all sold data for the user
    const getSoldData = async (user_id) => {
        const data = await getSold(user_id, setLoading);

        if (data.status === 'FAILED') {
            setSoldError(true);
            return;
        }

        setSoldData([...data.data]);
    }

    useEffect(() => {
        setLoading(true);
        getPurchaseData(_id);
        getSoldData(_id);
    }, [])
    return (
        <Stack direction="column" width="100%" spacing={2}>
            <Typography fontSize="xx-large">Transactions</Typography>
            <Divider orientation="horizontal" flexItem />
            <Stack direction="row" justifyContent="space-around">
                <Stack direction="column" spacing={2}>
                    <Typography fontWeight="bold">Purchase History</Typography>
                    {loading && <Box sx={{ width: '100%', }}>
                        <LinearProgress sx={{ "& .MuiLinearProgress-barColorPrimary": { backgroundColor: "#ff5722" }, bgcolor: "white" }} />
                    </Box>}
                    {!purchaseError ? <PurchaseTable data={purchaseData} /> : "Error loading purchase data!"}
                </Stack>
                <Stack direction="column" spacing={2}>
                    <Typography fontWeight="bold">Selling History</Typography>
                    {loading && <Box sx={{ width: '100%', }}>
                        <LinearProgress sx={{ "& .MuiLinearProgress-barColorPrimary": { backgroundColor: "#ff5722" }, bgcolor: "white" }} />
                    </Box>}
                    {!soldError ? <SoldTable data={soldData} /> : "Error loading sold data!"}
                </Stack>
            </Stack>
        </Stack>
    )
}
