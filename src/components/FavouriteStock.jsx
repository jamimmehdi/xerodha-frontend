import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'

const favourites = ['NIFTY 50', 'SENSEX']

export default function FavouriteStock() {
    return (
        <Stack width="100%" height="4rem" direction="row" px="5px" alignItems="center" justifyContent="space-around">
            {favourites.length > 0 && favourites.map((favourite, index) => (
                <Stack key={index} direction="row" spacing={0.5}>
                    <Typography fontWeight="400" fontSize="0.7rem">{favourite}</Typography>
                    <Typography fontWeight="400" fontSize="0.7rem" color="#2ecc71">175763.30</Typography>
                    <Typography fontWeight="400" fontSize="0.7rem" color="#bdc3c7">0.07%</Typography>
                </Stack>
            ))}
        </Stack>
    )
}
