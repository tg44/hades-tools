import {FC, useState} from "react";
import {AppBar, Box, CssBaseline, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

export interface Page {
    name: string,
    description: string,
    link: string,
}


export const pages = [
    {
        name: 'WS Destiny Calculator',
        description: 'A 2D calculator with all of the currently known shield mechanics implemented.',
        link: '/destiny',
    },
    {
        name: 'Research Calculator',
        description: 'A simple calculator to help you find out how many blueprints, artifacts, time needed to get your module upgrade goals.',
        link: '/research',
    },
    {
        name: 'Trader Calculator',
        description: 'A calculator that helps you with trade rate optimization.',
        link: '/trade',
    }
]

const Layout: FC<{ pages: Page[], children: React.ReactNode }> = ({pages, children}) => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <>
            <CssBaseline/>
            <AppBar position="static">
                <Toolbar>
                    <Box>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                        >
                            {pages.map((page) => (
                                <Link href={page.link} key={page.name} passHref>
                                    <MenuItem onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page.name}</Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        color="inherit"
                        noWrap
                        component="a"
                        href="/"
                    >
                        Hades tools
                    </Typography>
                </Toolbar>
            </AppBar>
            <main style={{marginTop: "1rem"}}>
                {children}
            </main>
        </>
    );
}

export default Layout;