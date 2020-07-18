// @packages
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';

// @scripts
import Order from '../components/orders/Order';

// @apollo
const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            cliente {
                nombre
                apellido
                email
                telefono
                id
            }
            pedido {
                cantidad
                nombre
                precio
            }
            id
            total
            estado
        }
    }
`;

// @styles
const useStyles = makeStyles((theme) => ({
    button: {
        margin: '0 0px 10px 0px',
        textAlign: 'end'
    },
    content: {
        paddingRight: 10,
        paddingLeft: 10,
        width: '100%'
    },
    title: {
        color: theme.palette.primary.main,
        marginTop: 10
    }
}));

const Orders = () => {
    const { data, loading } = useQuery(OBTENER_PEDIDOS);

    const classes = useStyles();

    const router = useRouter();

    if (loading) return null;

    const { obtenerPedidosVendedor } = data;

    return (
    <Grid className={classes.content} container>
        <Grid item xs={12}>
            <Typography className={classes.title} variant="h5">
                Pedidos
            </Typography>
        </Grid>
        <Grid className={classes.button} item xs={12}>
            <Button
                color="primary"
                onClick={() => router.push('/new-order')}
                variant="contained"
            >
                Agregar nuevo pedido
            </Button>
        </Grid>
        <Grid item xs={12}>
            {obtenerPedidosVendedor.map((order, index) =>(
                <Order key={index} order={order} />
            ))}
        </Grid>
    </Grid>
  );
}

export default Orders;