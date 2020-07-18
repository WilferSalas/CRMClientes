import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import React from 'react'
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

// @apollo
const OBTENER_USUARIO = gql `
    query obtenerUsuario {
        obtenerUsuario {
            nombre
            apellido
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: theme.palette.primary.main,
        fontSize: 15,
        height: 33,
        width: 33
    },
    toolbar: {
        background: 'white',
        color: theme.palette.primary.main,
        justifyContent: 'flex-end',
        marginLeft: 230,
        marginRight: 0,
        minHeight: 50,
        paddingLeft: 22,
        paddingRight: 5
    },
    typography: {
        fontWeight: 500
    }
}));

const Header = () => {
    const classes = useStyles();

    const { data, loading } = useQuery(OBTENER_USUARIO);

    const router = useRouter();

    if (loading) return null;

    if (!data.obtenerUsuario) {
        return router.push('/login');
    };

    const getNameInitials = (str) => {
        if (!str) {
            return '';
        }

        const tokens = str.split(' ');
        let initials = tokens[0].substring(0, 1).toUpperCase();

        if (tokens.length === 2) {
            initials += tokens[1].substring(0, 1).toUpperCase();
        } else if (tokens.length >= 3) {
            initials += tokens[2].substring(0, 1).toUpperCase();
        }

        return initials;
    };

    const handleOnClick = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const { nombre, apellido } = data.obtenerUsuario;

    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <Tooltip title={`${nombre} ${apellido}`}>
                    <Avatar
                        className={classes.avatar}
                    >
                        {getNameInitials(`${nombre} ${apellido}`)}
                    </Avatar>
                </Tooltip>
                <Tooltip title="Cerrar sesion">
                    <IconButton
                        color="primary"
                        component="span"
                        onClick={handleOnClick}
                    >
                        <ExitToAppIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}

export default Header;