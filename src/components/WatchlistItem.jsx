import { Box, Portal, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRealTimePrice, getWatchlistData, handleWatchlistActivity } from '../utils/Services/APICall';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { handleBuyModalOpen, handleSellModalOpen, setSelectedSymbol } from '../helper/BuyingSellingSlice';
import { useSnackbar } from 'notistack';
import { setUser } from '../helper/UserSlice';

const MarketDepth = ({ data }) => {
    const loaded = data.open ? true : false;

    return (
        <Stack direction="row" width="100%" spacing={1}>
            <Stack direction="column" width="50%" >
                <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="small" color="#bdc3c7">Open</Typography>
                    <Typography fontSize="small" >{loaded ? Number(data.open).toFixed(2) : "Error"}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="small" color="#bdc3c7">Low</Typography>
                    <Typography fontSize="small" >{loaded ? Number(data.low).toFixed(2) : "Error"}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="small" color="#bdc3c7">Volume</Typography>
                    <Typography fontSize="small" >{loaded ? Number(data.volume).toFixed(2) : "Error"}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="small" color="#bdc3c7">Change</Typography>
                    <Typography fontSize="small">{loaded ? Number(data.change).toFixed(2) : "Error"}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="small" color="#bdc3c7">Change Percent</Typography>
                    <Typography fontSize="small" >{loaded ? Number(data.percent_change).toFixed(2) : "Error"}</Typography>
                </Stack>
            </Stack>
            <Stack direction="column" width="50%" >
                <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="small" color="#bdc3c7">High</Typography>
                    <Typography fontSize="small" >{loaded ? Number(data.high).toFixed(2) : "Error"}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="small" color="#bdc3c7">Prev. Close</Typography>
                    <Typography fontSize="small" >{loaded ? Number(data.previous_close).toFixed(2) : "Error"}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="small" color="#bdc3c7">Avg. price</Typography>
                    <Typography fontSize="small" >{loaded ? Math.round((Number(data.high) + Number(data.low)) / 2).toFixed(2) : "Error"}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="small" color="#bdc3c7">Currency</Typography>
                    <Typography fontSize="small">{loaded ? data.currency : "Error"}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="small" color="#bdc3c7">Exchange</Typography>
                    <Typography fontSize="small" >{loaded ? data.exchange : "Error"}</Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}


export default function WatchlistItem({ symbol }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const { enqueueSnackbar } = useSnackbar();
    const [instrument, setInstrument] = useState({});
    const [livePrice, setLivePrice] = useState(null);
    const [instrumentError, setInstrumentError] = useState(false);
    const [livePriceError, setLivePriceError] = useState(false);
    const loaded = instrument.open ? true : false;

    const [show, setShow] = useState(false);
    const container = useRef(null);

    const handleClick = (event) => {
        event.stopPropagation();
        setShow(!show);
    };


    const style = {
        color: `${instrument.percent_change > 0 ? "green" : "red"}`
    }

    const fetchData = async () => {
        const data = await getWatchlistData(symbol);

        if (!data.status === 'OK') {
            setInstrumentError(true);
            return;
        }
        setInstrument({ ...data.data });
    }

    const getLivePrice = async (symbol) => {
        const price = await getRealTimePrice(symbol);

        if (!price.status === 'OK') {
            setLivePriceError(true);
            return;
        }

        setLivePrice(+price.price.price);
    }


    // Handle buying model open
    const handleBuyOpen = (event) => {
        event.stopPropagation();
        dispatch(setSelectedSymbol(symbol));
        dispatch(handleBuyModalOpen())
    };


    // Handle selling model open
    const handleSellOpen = (event) => {
        event.stopPropagation();
        dispatch(setSelectedSymbol(symbol));
        dispatch(handleSellModalOpen());
    };

    // Handle quotes add to watchlist
    const handleQuotesAddToWatchlist = async (event) => {
        event.stopPropagation();

        const data = {
            user_id: user._id,
            symbol: symbol
        }

        const watchlist = await handleWatchlistActivity(data);

        if (watchlist.status === 'FAILED') {
            enqueueSnackbar('Failed to remove quote from watchlist!', { variant: 'error' });
            return;
        }

        dispatch(setUser(watchlist.data));
        enqueueSnackbar('Quote successfully removed from watchlist!', { variant: 'success' });
    }

    useEffect(() => {
        getLivePrice(symbol);
        fetchData(symbol);
    }, [])

    return (
        !instrumentError ? <Stack direction="column" onClick={() => navigate(`${symbol}`)}>
            <Box sx={{ borderBottom: "1px solid #bdc3c7" }}>
                <Stack direction="row" py="15px" justifyContent="space-between" px="5px" alignItems="center">
                    <Typography textTransform="uppercase" fontSize="small" fontWeight="bold" sx={{ cursor: "pointer" }}>{symbol}</Typography>
                    <Stack direction="row" spacing={1}>
                        <Typography fontSize="x-small" sx={style}>{loaded ? `${Number(instrument.percent_change).toFixed(2)}%` : "Error"} </Typography>
                        <Typography fontSize="x-small" sx={style}>{!livePriceError && livePrice ? `$${livePrice.toFixed(2)}` : "Error"}</Typography>
                        <Tooltip title="Buy(B)">
                            <Box onClick={handleBuyOpen} sx={{ cursor: "pointer" }} px="15px" py="3px" bgcolor="#3498db" color="white" fontSize="small" borderRadius="3px">B</Box>
                        </Tooltip>
                        {/*<Tooltip title="Sell(S)">
                            <Box onClick={handleSellOpen} sx={{ cursor: "pointer" }} px="15px" py="3px" bgcolor="#e74c3c" color="white" fontSize="small" borderRadius="3px">S</Box>
                        </Tooltip>*/}
                        <Tooltip title="Market Depth(M)">
                            <Box onClick={handleClick} sx={{ cursor: "pointer" }} px="15px" py="2px" display="flex" alignItems="center" bgcolor="white" border="1px solid #bdc3c7" borderRadius="3px"><AlignHorizontalCenterIcon fontSize='0.3rem' /></Box>
                        </Tooltip>
                        <Tooltip title="Remove from Watchlist">
                            <Box onClick={handleQuotesAddToWatchlist} sx={{ cursor: "pointer" }} px="15px" py="2px" display="flex" alignItems="center" bgcolor="white" border="1px solid #bdc3c7" borderRadius="3px"><RemoveCircleOutlineIcon fontSize='0.3rem' /></Box>
                        </Tooltip>
                    </Stack>
                </Stack>
                {show ? (
                    <Portal container={container.current}>
                        <MarketDepth data={instrument} />
                    </Portal>
                ) : null}
            </Box>
            <Box ref={container} />
        </Stack> : "Error Loading Instrument"
    )
}
