import { CircularProgress, FormControl, FormControlLabel, Modal, Radio, RadioGroup, Stack, TextField, Typography, } from '@mui/material';
import { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useDispatch, useSelector } from 'react-redux';
import { handleBuyModalClose } from '../helper/BuyingSellingSlice';
import { useEffect } from 'react';
import { buyStocks, getRealTimePrice, updateBalance } from '../utils/Services/APICall';
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

export default function BuyingModal() {
    const open = useSelector((state) => state.buy_sell.buy_modal_visibility);
    const symbol = useSelector((state) => state.buy_sell.selected_symbol);
    const { margin_available, _id } = useSelector((state) => state.user.user);

    const [livePrice, setLivePrice] = useState(0);
    const [livePriceError, setLivePriceError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const marginRequired = (quantity * livePrice).toFixed(2);
    const maxQuantity = Math.floor(margin_available / livePrice);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const handleClose = () => dispatch(handleBuyModalClose());

    const handleQuantityChange = (event) => quantity < maxQuantity && setQuantity(event.target.value);

    const getLivePrice = async (symbol) => {
        const price = await getRealTimePrice(symbol);

        if (price.status === 'FAILED') {
            setLivePriceError(true);
            return;
        }

        setLivePrice(+price.price.price);
    }

    // Handle buy
    const handleBuy = async () => {
        setLoading(true);

        const buyingDetails = {
            "user_id": _id,
            "symbol": symbol,
            "buying_price": livePrice,
            "buying_date": new Date(),
            "quantity": quantity
        }

        const data = await buyStocks(buyingDetails, setLoading);

        if (data.status === 'FAILED') {
            setLivePriceError(true);
            enqueueSnackbar('Something went wrong!', { variant: 'error' });
            return;
        }

        enqueueSnackbar('Order placed successfully!', { variant: 'success' });
        updateBalance(_id, dispatch);
        
        handleClose();
    }

    useEffect(() => {
        if (symbol) getLivePrice(symbol);

        return () => {
            setQuantity(1);
        }
    }, [symbol])
    return (
        <Modal open={open} onClose={handleClose} keepMounted={false}>
            <Stack sx={style} direction="column" spacing={1}>
                <Stack direction="column" py="1rem" px="0.5rem" bgcolor="#4184f3">
                    <Typography fontWeight="medium" color="white">{`Buy ${symbol} x ${quantity} Qty at $${!livePriceError ? livePrice : "Error"}`}</Typography>
                </Stack>
                <FormControl>
                    <RadioGroup sx={{ px: "1rem" }} row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                        <FormControlLabel checked value="female" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />} label="Longterm" />
                        <FormControlLabel value="disabled" disabled control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />} label="Intraday" />
                    </RadioGroup>
                </FormControl>
                <Stack direction="row" width="100%" justifyContent="space-between" p="1rem">
                    <TextField type="number" InputProps={{ max: maxQuantity, min: 1 }} label="Qty" value={quantity} onChange={handleQuantityChange} sx={{ width: "180px" }} size="small" />
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
                        <Typography fontSize="small">Margin required</Typography>
                        <Typography fontSize="small">{!livePriceError ? `$ ${marginRequired}` : "Error"}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <ButtonGroup variant="outlined" aria-label="outlined button group">
                            <Button onClick={handleBuy}>{!loading ? "Buy" : <CircularProgress size="1.5rem" />}</Button>
                            <Button onClick={handleClose}>Cancel</Button>
                        </ButtonGroup>
                    </Stack>
                </Stack>
            </Stack>
        </Modal>
    )
}
