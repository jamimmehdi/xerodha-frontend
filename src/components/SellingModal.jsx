import { CircularProgress, FormControl, FormControlLabel, Modal, Radio, RadioGroup, Stack, TextField, Typography, } from '@mui/material';
import { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useDispatch, useSelector } from 'react-redux';
import { handleBuyModalClose, handleSellModalClose } from '../helper/BuyingSellingSlice';
import { useEffect } from 'react';
import { getRealTimePrice, sellStocks } from '../utils/Services/APICall';
import { useSnackbar } from 'notistack';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
};

export default function SellingModal() {
    const { current_holding_id, selected_symbol, sell_modal_visibility, current_available_quantity } = useSelector((state) => state.buy_sell);
    const { _id } = useSelector((state) => state.user.user);
    const [livePrice, setLivePrice] = useState(0);
    const [livePriceError, setLivePriceError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => dispatch(handleSellModalClose());

    const handleQuantityChange = (event) => {
        const inRange = event.target.value >= 1 && event.target.value <= current_available_quantity ? true : false;
        inRange && setQuantity(event.target.value)
    };

    const getLivePrice = async (selected_symbol) => {
        const price = await getRealTimePrice(selected_symbol);

        if (price.status === 'FAILED') {
            setLivePriceError(true);
            return;
        }

        if (price.price.price) setLivePrice(+price.price.price);
    }

    // Handle sell
    const handleSell = async () => {
        setLoading(true);

        const sellingDetails = {
            "user_id": _id,
            "holding_id": current_holding_id,
            "symbol": selected_symbol,
            "selling_price": livePrice,
            "selling_date": new Date(),
            "quantity": quantity
        }

        const data = await sellStocks(sellingDetails, setLoading);

        if (data.status === 'FAILED') {
            setLivePriceError(true);
            enqueueSnackbar('Something went wrong!', { variant: 'error' });
            return;
        }

        enqueueSnackbar('Order sold successfully!', { variant: 'success' });
        handleClose();
    }

    useEffect(() => {
        if (selected_symbol) getLivePrice(selected_symbol);

        return () => {
            setQuantity(1);
        }
    }, [selected_symbol])
    return (
        <Modal
            open={sell_modal_visibility}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            keepMounted={false}
        >
            <Stack sx={style} direction="column" spacing={1}>
                <Stack direction="column" py="1rem" px="0.5rem" bgcolor="#ff5722">
                    <Typography fontWeight="medium" color="white">{`Sell ${selected_symbol} x ${quantity} Qty at $${!livePriceError ? livePrice : "Error"}`}</Typography>
                </Stack>
                <FormControl>
                    <RadioGroup sx={{ px: "1rem" }} row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                        <FormControlLabel checked value="female" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />} label="Longterm" />
                        <FormControlLabel value="disabled" disabled control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />} label="Intraday" />
                    </RadioGroup>
                </FormControl>
                <Stack direction="row" width="100%" justifyContent="space-between" p="1rem">
                    <TextField type="number" InputProps={{ max: 5, min: 1 }} label="Qty" value={quantity} onChange={handleQuantityChange} sx={{ width: "180px" }} size="small" />
                    <TextField type="number" label="Price" sx={{ width: "180px" }} size="small" defaultValue={livePrice} disabled />
                </Stack>
                <FormControl>
                    <RadioGroup sx={{ px: "1rem" }} row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                        <FormControlLabel checked value="female" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />} label="Market" />
                        <FormControlLabel value="disabled" disabled control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />} label="Limit" />
                    </RadioGroup>
                </FormControl>
                <Stack direction="row" justifyContent="space-between" px="1rem" py="1rem" alignItems="center" bgcolor="#f9f9f9">
                    <Stack direction="row" spacing={1}>
                        <Typography fontSize="small">Available quantity to sell -</Typography>
                        <Typography fontSize="small" fontWeight="bold">{current_available_quantity}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <ButtonGroup variant="outlined" aria-label="outlined button group">
                            <Button onClick={handleSell}>{!loading ? "Sell" : <CircularProgress size="1.5rem" />}</Button>
                            <Button onClick={handleClose}>Cancel</Button>
                        </ButtonGroup>
                    </Stack>
                </Stack>
            </Stack>
        </Modal>
    )
}
