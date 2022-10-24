import { Box, Divider, Skeleton, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom'
import Chart from '../components/Chart';
import TableData from '../components/TableData';
import { get7DaysData, getDataWithLogoAndSummary, getRealTimePrice } from '../utils/Services/APICall';

export default function Instrument() {
    const { symbol } = useParams();
    const [livePrice, setLivePrice] = useState(null);
    const [data, setData] = useState([]);
    const [moreInfo, setMoreInfo] = useState({});
    const [dataError, setDataError] = useState(false);
    const [livePriceError, setLivePriceError] = useState(false);
    const [moreInfoError, setMoreInfoError] = useState(false);
    const loaded = moreInfo.logo_url ? true : false;

    // Last 7 days historical data
    const getData = async (symbol) => {
        const data = await get7DaysData(symbol);

        if (data.status === 'FAILED') {
            setDataError(true);
            return;
        }

        const dataObj = data.data['Time Series (Daily)'];
        const chartData = Object.keys(dataObj).map((key) => {
            const data = {};
            data["date"] = key;
            data["open"] = Number(dataObj[key]["1. open"]);
            data["high"] = Number(dataObj[key]["2. high"]);
            data["low"] = Number(dataObj[key]["3. low"]);
            data["close"] = Number(dataObj[key]["4. close"]);
            data["volume"] = Number(dataObj[key]["5. volume"]);

            return data;
        });

        setData([...chartData]);
    }


    // Live price of the instrument
    const getLivePrice = async (symbol) => {
        const price = await getRealTimePrice(symbol);

        if (!price.status === 'OK') {
            setLivePriceError(true);
            return;
        }

        setLivePrice(+price.price.price);
    }


    // More info about the instrument: Logo, Description
    const getMoreInfo = async (symbol) => {
        const data = await getDataWithLogoAndSummary(symbol);

        if (!data.status === 'OK') {
            setMoreInfoError(true);
            return;
        }

        setMoreInfo({ ...data.data });
    }

    useEffect(() => {
        getData(symbol);
        getLivePrice(symbol);
        getMoreInfo(symbol);
    }, [symbol]);

    return (
        <Stack direction="column" p="1rem" spacing={5}>
            <Stack direction="row" spacing={2}>
                <Box height="50px" width="50px" sx={{ borderRadius: "50%", border: "1px solid gainsboro", overflow: "hidden" }}>
                    {loaded ? <img src={moreInfo.logo_url} style={{ height: "100%", width: "100%", objectfit: "cover" }} /> :
                        <Skeleton variant="circular" width={50} height={50} />}
                </Box>
                <Stack direction="column">
                    <Typography fontSize="large" fontWeight="bold">{symbol}</Typography>
                    <Typography fontSize="small">{moreInfo.shortName}</Typography>
                </Stack>
                <Stack direction="column">
                    <Typography fontSize="large" fontWeight="bold">{!livePriceError ? `$${livePrice}` : "Error"}</Typography>
                    <Typography fontSize="small">{moreInfo.open}</Typography>
                </Stack>
            </Stack>

            <Typography fontWeight="bold">Historical Reports</Typography>
            <Box height={250} >
                <Chart data={data} />
            </Box>
            <TableData data={data} />
            <Typography fontWeight="bold">About Company</Typography>
            <Typography fontSize="small">{loaded ? moreInfo.longBusinessSummary : "Error"}</Typography>
        </Stack>
    )
}
