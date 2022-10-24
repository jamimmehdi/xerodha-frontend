import { Box, Divider, useMediaQuery } from '@mui/material'
import { Stack } from '@mui/system'
import { Outlet } from 'react-router-dom'
import BuyingModal from './BuyingModal'
import FavouriteStock from './FavouriteStock'
import Navbar from './Navbar'
import SellingModal from './SellingModal'
import Sidebar from './Sidebar'

export default function SidebarNavbarWrapper() {
    const isLargerThan800 = useMediaQuery('(min-width:800px)');

    return (
        <Stack direction="column" width="100%" minHeight="100vh">
            <Stack direction="row" boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px">
                {isLargerThan800 && <Box width="30%" maxWidth="350px"><FavouriteStock /></Box>}
                <Divider orientation="vertical" flexItem />
                <Box width={isLargerThan800 ? "70%" : "100%"}><Navbar /></Box>
            </Stack>
            <Stack direction="row">
                {isLargerThan800 && <Box width="30%" maxWidth="350px" minHeight="calc(100vh - 4rem)" boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px"><Sidebar /></Box>}
                <Box width={isLargerThan800 ? "calc(100vw - 300px)" : "100%"} p="1rem" maxHeight="calc(100vh - 4rem)" sx={{ overflowY: "scroll" }}>
                    <BuyingModal />
                    <SellingModal />
                    <Outlet />
                </Box>
            </Stack>
        </Stack>
    )
}
