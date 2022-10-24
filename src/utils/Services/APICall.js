
import axios from 'axios';
import { updateUserBalance } from '../../helper/UserSlice';
import { BASE__URL } from '../config.BASE__URL';

// Register user
export const registerUser = async (credential, setLoading) => {
    try {
        const URL = `${BASE__URL}/api/v1/auth/register`;
        const response = await axios.post(URL, credential);
        const data = await response.data;

        localStorage.setItem('user', JSON.stringify(data));

        setLoading(false);
        return { status: "OK", data };
    } catch (err) {
        setLoading(false);
        return { status: "FAILED", err };
    }
}

// Login
export const loginUser = async (credential, setLoading) => {
    try {
        const URL = `${BASE__URL}/api/v1/auth/login`;
        const response = await axios.post(URL, credential);
        const data = await response.data;

        setLoading(false);
        return { status: "OK", data };
    } catch (err) {
        setLoading(false);
        return { status: "FAILED", err };
    }
}

export const searchData = async (keyword) => {
    if (!keyword) return;

    try {
        const URL = `${BASE__URL}/api/v1/user/search/${keyword}`;
        const response = await axios.get(URL);
        const data = await response.data;

        return { status: "OK", data };
    } catch (err) {
        return { status: "FAILED", err };
    }
}

export const getWatchlistData = async (symbol) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://twelve-data1.p.rapidapi.com/quote',
            params: { symbol: symbol, interval: '1day', outputsize: '30', format: 'json' },
            headers: {
                'X-RapidAPI-Key': 'd5516eb7ebmsh18a436351a918bdp1a5635jsn817af44262e9',
                'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        const data = await response.data;

        return { status: "OK", data };
    } catch (err) {
        return { status: "FAILED", err };
    }
}

// Get live price
export const getRealTimePrice = async (symbol) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://twelve-data1.p.rapidapi.com/price',
            params: { symbol: symbol, format: 'json', outputsize: '30' },
            headers: {
                'X-RapidAPI-Key': 'd5516eb7ebmsh18a436351a918bdp1a5635jsn817af44262e9',
                'X-RapidAPI-Host': 'twelve-data1.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        const price = await response.data;

        return { status: "OK", price };
    } catch (err) {
        return { status: "FAILED" };
    }
}

export const get7DaysData = async (symbol) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://alpha-vantage.p.rapidapi.com/query',
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol: symbol,
                outputsize: 'compact',
                datatype: 'json'
            },
            headers: {
                'X-RapidAPI-Key': 'd5516eb7ebmsh18a436351a918bdp1a5635jsn817af44262e9',
                'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        const data = await response.data;

        return { status: "OK", data };
    } catch (err) {
        return { status: "FAILED" };
    }
}

export const getDataWithLogoAndSummary = async (symbol) => {
    try {
        const encodedParams = new URLSearchParams();
        encodedParams.append("symbol", symbol);
        const options = {
            method: 'POST',
            url: 'https://yahoo-finance97.p.rapidapi.com/stock-info',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': 'd5516eb7ebmsh18a436351a918bdp1a5635jsn817af44262e9',
                'X-RapidAPI-Host': 'yahoo-finance97.p.rapidapi.com'
            },
            data: encodedParams
        };

        const response = await axios.request(options);
        const data = await response.data.data;

        return { status: "OK", data };
    } catch (err) {
        return { status: "FAILED" };
    }
}

export const handleWatchlistActivity = async (watchlist) => {
    try {
        const URL = `${BASE__URL}/api/v1/user/watchlist_activity`;
        const response = await axios.put(URL, watchlist);
        const data = await response.data;

        return { status: "OK", data };
    } catch (err) {
        return { status: "FAILED", err };
    }
}

export const getUserbalance = async (user_id, setLoading) => {
    try {
        const URL = `${BASE__URL}/api/v1/user/balance/${user_id}`;
        const response = await axios.get(URL);
        const data = await response.data;

        setLoading(false);

        return { status: "OK", data };
    } catch (err) {
        setLoading(false);
        return { status: "FAILED", err };
    }
}

export const updateBalance = async (user_id, dispatch) => {
    try {
        const URL = `${BASE__URL}/api/v1/user/balance/${user_id}`;
        const response = await axios.get(URL);
        const data = await response.data;

        dispatch(updateUserBalance({ ...data }))
    } catch (err) {

        return { status: "FAILED", err };
    }
}


export const getHoldings = async (user_id, setLoading) => {
    try {
        const URL = `${BASE__URL}/api/v1/user/holdings/${user_id}`;
        const response = await axios.get(URL);
        const data = await response.data;

        setLoading(false);

        return { status: "OK", data };
    } catch (err) {
        setLoading(false);
        return { status: "FAILED", err };
    }
}

export const getPurchase = async (user_id, setLoading) => {
    try {
        const URL = `${BASE__URL}/api/v1/user/purchase/${user_id}`;
        const response = await axios.get(URL);
        const data = await response.data;

        setLoading(false);

        return { status: "OK", data };
    } catch (err) {
        setLoading(false);
        return { status: "FAILED", err };
    }
}

export const getSold = async (user_id, setLoading) => {
    try {
        const URL = `${BASE__URL}/api/v1/user/sold/${user_id}`;
        const response = await axios.get(URL);
        const data = await response.data;

        setLoading(false);

        return { status: "OK", data };
    } catch (err) {
        setLoading(false);
        return { status: "FAILED", err };
    }
}


export const buyStocks = async (buyingDetails, setLoading) => {
    try {
        const URL = `${BASE__URL}/api/v1/user/buy`;
        const response = await axios.post(URL, buyingDetails);
        const data = await response.data;

        setLoading(false);

        return { status: "OK", data };
    } catch (err) {
        setLoading(false);
        return { status: "FAILED", err };
    }
}

export const sellStocks = async (sellingDetails, setLoading) => {
    try {
        const URL = `${BASE__URL}/api/v1/user/sell`;
        const response = await axios.post(URL, sellingDetails);
        const data = await response.data;

        setLoading(false);

        return { status: "OK", data };
    } catch (err) {
        setLoading(false);
        return { status: "FAILED", err };
    }
}

