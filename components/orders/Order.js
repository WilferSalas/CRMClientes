// @packages
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Alert from '@material-ui/lab/Alert';
import CallIcon from '@material-ui/icons/Call';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EmailIcon from '@material-ui/icons/Email';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import Select from '@material-ui/core/Select';
import Swal from 'sweetalert2'
import Typography from '@material-ui/core/Typography';
import numeral from 'numeral';
import theme from '../../src/theme';
import withReactContent from 'sweetalert2-react-content'
import { gql, useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';

// @apollo
const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput) {
        actualizarPedido(id: $id, input: $input) {
            estado
        }
    }
`;

const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!) {
        eliminarPedido(id: $id)
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

//@styles
const useStyles = makeStyles((theme) => ({
    alert: {
        margin: '0 15px'
    },
    formControl: {
        minWidth: 220
    },
    icon: {
        alignSelf: 'center',
        display: 'inline-block'
    },
    iconDelete: {
        color: '#b4341d'
    },
    iconEdit: {
        color: '#69b41d'
    },
    iconUser: {
        marginRight: 10
    },
    paper: {
        margin: '10px 0',
        padding: 20
    },
    select: {
        '& .MuiOutlinedInput-input': {
            padding: '10px 14px'
        }
    },
    userInfo: {
        display: 'flex'
    }
}));

const Order = ({ order }) => {
    const classes = useStyles();

    console.log(order)


    const {
        cliente: {
            apellido,
            email,
            nombre,
            telefono
        },
        cliente,
        estado,
        id,
        pedido,
        total
    } = order;

    const [state, setState] = useState({
        errorMessage: '',
        errorStatus: '',
        orderState: estado,
        showPassword: false
    });

    const [ actualizarPedido ] = useMutation(ACTUALIZAR_PEDIDO);

    const [ eliminarPedido ] = useMutation(ELIMINAR_PEDIDO, {
        update(cache) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS
            });

            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: { obtenerPedidosVendedor: obtenerPedidosVendedor
                        .filter(producto => producto.id !== id) }
            });
        }
    });

    const MySwal = withReactContent(Swal);

    const getColorState = (orderState) => {
        if (orderState === "Completado") {
            return '#69B41D';
        } else if (orderState === "Pendiente") {
            return '#FFB90F';
        }

        return '#B4341D';
    };

    const handleChange = async (event) => {
        try {
            const { data } = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        estado: event.target.value,
                        cliente: cliente.id
                    }
                }
            });

            setState({
                ...state,
                orderState: data.actualizarPedido.estado
            });
        } catch (error) {
            console.log(error)
        }
    };

    const handleOnDelete = async () => {
        MySwal.fire({
            title: ' ¿Estas seguro de esto?',
            text: 'Este cambio no se puede revertir',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: theme.palette.primary.main,
            cancelButtonColor: theme.palette.primary.main,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
       }).then( async (result) => {
            if(result.value){
                try {
                    const { data } = await eliminarPedido({
                        variables: {
                            id
                        }
                    });

                    MySwal.fire({
                        title: 'Eliminado',
                        text: data.eliminarPedido,
                        icon: 'success',
                        confirmButtonColor: theme.palette.primary.main
                    });
                } catch (error) {
                    MySwal.fire(
                        error.message,
                        'error'
                    );
                }
            }
        });
    }

    return (
        <Paper
            className={classes.paper}
            elevation={3}
            style={{ borderTop: `5px solid ${getColorState(state.orderState)}` }}
        >
            <Grid container spacing={3}>
                <Grid item xs={5}>
                    <Typography gutterBottom variant="subtitle2">
                        Cliente:
                    </Typography>
                    <div className={classes.userInfo}>
                        <AccountBoxIcon className={classes.iconUser} fontSize="small" />
                        <Typography variant="caption" display="block" gutterBottom>
                            {nombre} {apellido}
                        </Typography>
                    </div>
                    <div className={classes.userInfo}>
                        <EmailIcon className={classes.iconUser} fontSize="small" />
                        <Typography variant="caption" display="block" gutterBottom>
                            {email}
                        </Typography>
                    </div>
                    {telefono &&
                        <div className={classes.userInfo}>
                            <CallIcon className={classes.iconUser} fontSize="small" />
                            <Typography variant="caption" display="block" gutterBottom>
                                {telefono}
                            </Typography>
                        </div>
                    }
                </Grid>
                <Grid item xs={6}>
                    <Typography gutterBottom variant="subtitle2">
                        Resumen del pedido:
                    </Typography>
                    {pedido.map((product, index) => (
                        <div key={index}>
                            <Typography
                                variant="caption"
                                display="block"
                                gutterBottom
                            >
                                Producto: {product.nombre}
                            </Typography>
                            <Typography
                                variant="caption"
                                display="block"
                                gutterBottom
                            >
                                Cantidad: {product.cantidad}
                            </Typography>
                        </div>
                    ))}
                </Grid>
                <Grid className={classes.icon} item xs={1}>
                    <IconButton aria-label="delete" className={classes.margin}>
                        <EditIcon className={classes.iconEdit} />
                    </IconButton>
                </Grid>
                <Grid item xs={5}>
                    <Typography gutterBottom variant="subtitle2">
                        Estado del pedido:
                    </Typography>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <Select
                            className={classes.select}
                            id="product-state"
                            labelId="product-state"
                            onChange={handleChange}
                            value={state.orderState}
                        >
                            <MenuItem value="Completado">Completado</MenuItem>
                            <MenuItem value="Pendiente">Pendiente</MenuItem>
                            <MenuItem value="Cancelado">Cancelado</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <Typography gutterBottom variant="subtitle2">
                        Total a pagar:
                    </Typography>
                    <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                    >
                        {numeral(total).format('($ 0,0)')}
                    </Typography>
                </Grid>
                <Grid className={classes.icon} item xs={1}>
                    <IconButton
                        aria-label="edit"
                        className={classes.margin}
                        onClick={handleOnDelete}
                    >
                        <DeleteIcon className={classes.iconDelete} />
                    </IconButton>
                </Grid>
                {state.errorMessage &&
                    <Grid className={classes.alert} item xs={12}>
                        <Alert severity={state.errorStatus}>
                            {state.errorMessage}
                        </Alert>
                    </Grid>
                }
            </Grid>
        </Paper>
    );
}

export default Order;