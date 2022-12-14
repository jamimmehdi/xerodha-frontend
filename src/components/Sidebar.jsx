import { Stack } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search';
import { Box, Divider, LinearProgress, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { handleWatchlistActivity, searchData } from '../utils/Services/APICall';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../helper/UserSlice';
import { useSnackbar } from 'notistack';
import WatchlistItem from './WatchlistItem';

const Stock = ({ symbol, name, exchange, currentTab }) => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    // Handle quotes add to watchlist
    const handleQuotesAddToWatchlist = async () => {
        const data = {
            "user_id": user._id,
            "tab": currentTab,
            "symbol": symbol
        }
        const watchlist = await handleWatchlistActivity(data);

        if (watchlist.status === 'FAILED') {
            enqueueSnackbar('Failed to add quote to watchlist!', { variant: 'error' });
            return;
        }

        dispatch(setUser(watchlist.data));
        enqueueSnackbar('Quote successfully added to watchlist!', { variant: 'success' });
    }

    return (
        <Stack onClick={handleQuotesAddToWatchlist} direction="row" justifyContent="space-between" alignItems="center" px="7px" py="10px" sx={{ '&:hover': { cursor: 'pointer', backgroundColor: "#f9f9f9" } }}>
            <Typography fontSize="small" color="#444444">{symbol}</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography fontSize="x-small" color="#444444" fontWeight="400" textTransform="uppercase">{name}</Typography>
                <Typography fontSize="x-small" px="7px" py="2px" borderRadius="4px" bgcolor="rgb(223,81,76, 0.1)" color="#df514c">{exchange}</Typography>
            </Stack>
        </Stack>
    )
}

export default function Sidebar() {
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [timeoutId, setTimeoutId] = useState(null);
    const [searchError, setSearchError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [watchlistVisible, setWatchlistVisible] = useState(false);
    const { name, _id, watchlist } = useSelector((state) => state.user.user);
    const tabCount = ['1', '2', '3'];
    const [currentTab, setCurrentTab] = useState('1');


    // Get filtered data
    const getFilteredData = async (keyword) => {
        const data = await searchData(keyword);
        if (!data.status === 'OK') {
            setSearchError(true);
            setLoading(false);
            return;
        }

        setFilteredStocks([...data.data]);
        setLoading(false);
    }

    // Handle stock search by name || symbol
    const handleSearch = (event) => {
        if (timeoutId) clearTimeout(timeoutId);
        if (!event.target.value) {
            setFilteredStocks([]);
            return;
        };
        setLoading(true);
        const newTimeoutId = setTimeout(() => {
            getFilteredData(event.target.value);
        }, 800);
        setTimeoutId(newTimeoutId);
    }

    return (
        <Stack direction="column">
            <Stack direction="row" px="10px" py="10px" alignItems="center" spacing={1}>
                <SearchIcon fontSize='0.7rem' color="#bdc3c7" />
                <input onFocus={() => setWatchlistVisible(true)} onBlur={() => setWatchlistVisible(false)} onChange={handleSearch} type="text" placeholder='Search eg: infy bse, nifty fut' style={{ width: '100%', height: '2rem', border: 'none', outline: 'none' }} />
            </Stack>
            <Divider light />

            {loading && <Box sx={{ width: '100%', }}>
                <LinearProgress sx={{ "& .MuiLinearProgress-barColorPrimary": { backgroundColor: "#ff5722" }, bgcolor: "white" }} />
            </Box>}

            <Stack direction="column" height="calc(100vh - 8rem)" sx={{ overflowY: "scroll" }}>
                <Stack direction="column" height="calc(100vh - 8rem)" sx={{ overflowY: "scroll" }}>
                    {!searchError ? filteredStocks.length > 0 && filteredStocks.map((stock) => (
                        <Stock key={stock.symbol} symbol={stock.symbol} name={stock.name} exchange={stock.exchange} currentTab={currentTab} />
                    )) : "Opps Error searching data..."}
                </Stack>
                <Stack direction="column" height="calc(100vh - 8rem)">
                    <Typography fontWeight="bold">Watchlist</Typography>
                    <Stack direction="row" my="5px">
                        {tabCount.length > 0 && tabCount.map((item, index) => (
                            <Box onClick={() => setCurrentTab(item)} key={index} fontWeight="bold" px="2rem" py="5px" width="2rem" sx={{ bgcolor: `${currentTab === item ? 'white' : '#ecf0f1'}`, cursor: "pointer" }}>{item}</Box>
                        ))}
                    </Stack>
                    {watchlist.length > 0 && watchlist.map((instrument, index) => {
                        if (instrument.tab === currentTab) return (
                            <WatchlistItem key={index} symbol={instrument.symbol} currentTab={instrument.tab} />
                        )
                    })}
                </Stack>

            </Stack>
        </Stack>
    )
}
