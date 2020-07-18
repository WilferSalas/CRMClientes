// @packges
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    content: {
        margin: '5px 0 5px 10px'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white
    },
    listItemSelected: {
        backgroundColor: '#434B57',
        '&:hover': {
            backgroundColor: '#434B57'
        }
    },
    subtitle: {
        fontWeight: 300
    },
    title: {
        fontWeight: 600,
        margin: '10px 0 0 15px;'
    }
}));

const menuItems = [
    { id: 1, name: "Clientes", url: "/" },
    { id: 2, name: "Pedidos", url: "/orders" },
    { id: 3, name: "Productos", url: "/products" },
    { id: 4, name: "Mejores vendedores", url: "/best-sellers"},
    { id: 5, name: "Mejores clientes", url: "/best-clients" }
]

const Sidebar = () => {
    const classes = useStyles();

    const router = useRouter();

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
        >
            <Typography className={classes.title} variant="h5">
                CMR
            </Typography>
            <List>
                {menuItems.map((item, index) => (
                    <Link
                        color="inherit"
                        href={item.url}
                        key={index}
                        underline="none"
                    >
                        <ListItem
                            className={item.url === router.pathname
                                ? classes.listItemSelected
                                : null}
                            button
                        >
                            <ListItemText
                                primary={
                                    <Typography className={classes.subtitle}>
                                        {item.name}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Drawer>
    );
}

export default Sidebar;