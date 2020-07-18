// @packages
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import OrderContext from '../context/orders/OrderContext';
import Paper from '@material-ui/core/Paper';
import React, { useContext, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

// @scripts
import AssignClient from '../components/orders/AssignProduct';
import AssignOrder from '../components/orders/AssignOrder';
import OrderSumary from '../components/orders/OrderSumary';
import Total from '../components/orders/Total';

// @apollo
const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput) {
        nuevoPedido(input: $input) {
            id
        }
    }
`;

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
    alert: {
        margin: '0 15px'
    },
    button: {
        marginTop: 20,
        textAlign: 'center'
    },
    content: {
        margin: '0px 10px 5px 0px',
        paddingRight: 15,
        paddingLeft: 5,
        width: '100%'
    },
    paper: {
        background: theme.palette.primary.main,
        padding: 20,
        marginTop: 20
    },
    title: {
        color: theme.palette.primary.main
    }
}));

const NewOrder = () => {
    const [state, setState] = useState({
        errorMessage: '',
        errorStatus: '',
        showPassword: false
    });

    const orderContext = useContext(OrderContext);

    const [ nuevoPedido ] = useMutation(NUEVO_PEDIDO, {
        update(cache, { data: { nuevoPedido } }) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS
            });

            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: { obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido] }
            });
        }
    });

    const router = useRouter();

    const classes = useStyles();

    const { clients, products, total } = orderContext;

    const validateOrder = () => {
        return !products
            .every(product => product.cantidad > 0)
                || total === 0
                || clients.length === 0
    };

    const handleOnCreate = async () => {
        const { id } = clients;

        const pedido = products.map(({
            existencia,
            __typename,
            ... product
        }) => product);

        try {
            await nuevoPedido({
                variables: {
                    input: {
                        cliente: id,
                        total,
                        pedido
                    }
                }
            });

            setState({
                errorMessage: 'Pedido agregado',
                errorStatus: 'success'
            });

            setTimeout(() => {
                setState({ errorMessage: null, errorStatus: '' });
                router.push('/orders');
            }, 2000);
        } catch (error) {
            setState({ errorMessage: error.message, errorStatus: 'warning' });

            setTimeout(() => {
                setState({ errorMessage: null, errorStatus: '' });
            }, 3000);
        }
    }

    return (
        <Grid
            className={classes.content}
            container
            spacing={2}
        >
            <Grid item xs={12}>
                <Typography className={classes.title} variant="h5">
                    Crear nuevo pedido
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <AssignOrder />
            </Grid>
            <Grid item xs={12}>
                <AssignClient />
            </Grid>
            <Grid item xs={12}>
                <OrderSumary />
                <Paper className={classes.paper}>
                    <Total />
                </Paper>
            </Grid>
            <Grid
                className={classes.button}
                item
                xs={12}
            >
                <Button
                    color="primary"
                    disabled={validateOrder()}
                    onClick={handleOnCreate}
                    variant="contained"
                >
                    Registrar pedido
                </Button>
            </Grid>
            {state.errorMessage &&
                <Grid item xs={12}>
                    <Alert severity={state.errorStatus}>
                        {state.errorMessage}
                    </Alert>
                </Grid>
            }
        </Grid>
    );
}

export default NewOrder;