// @packages
import * as Yup from 'yup';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

// @scripts
import FormProduct from '../components/FormProduct';

// @apollo
const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            nombre
            existencia
            precio
            creado
        }
    }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      nombre
      existencia
      precio
    }
  }
`;

// @styles
const useStyles = makeStyles((theme) => ({
    alert: {
        margin: '0 15px'
    },
    content: {
        margin: '0px 10px 5px 0px',
        paddingRight: 15,
        paddingLeft: 5,
        width: '100%'
    },
    title: {
        color: theme.palette.primary.main
    }
}));

const NewProduct = () => {
    const [state, setState] = useState({
        errorMessage: '',
        errorStatus: '',
        showPassword: false
    });

    const [ nuevoProducto ] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data: { nuevoProducto } }) {
            const { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS
            });

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: { obtenerProductos: [...obtenerProductos, nuevoProducto] }
            });
        }
    });

    const router = useRouter();

    const handleOnCreate = async (values) => {
        const {
            existencia,
            nombre,
            precio
        } = values;

        console.log(values)

        try {
            await nuevoProducto({
                variables: {
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            });

            setState({
                errorMessage: 'Producto agregado',
                errorStatus: 'success'
            });

            setTimeout(() => {
                setState({ errorMessage: null, errorStatus: '' });
                router.push('/products');
            }, 2000);
        } catch (error) {
            setState({ errorMessage: error.message, errorStatus: 'warning' });

            setTimeout(() => {
                setState({ errorMessage: null, errorStatus: '' });
            }, 3000);
        }
    };

    const formik = useFormik({
        initialValues: {
            existencia: '',
            nombre: '',
            precio: ''
        },
        validationSchema: Yup.object({
            existencia: Yup.string().required('La cantidad es requerida es obligatoria'),
            nombre: Yup.string().required('El nombre es obligatoria'),
            precio: Yup.string().required('El precio es obligatoria')
        }),
        onSubmit: values => handleOnCreate(values)
    });

    const isValidTextField = (id) => {
        if (Boolean(formik.touched[id] && formik.errors[id])) {
            return true;
        }

        return false;
    };

    const classes = useStyles();

    const {
        existencia,
        nombre,
        precio
    } = formik.values;

    return (
        <form
            autoComplete="off"
            noValidate
            onSubmit={formik.handleSubmit}
        >
            <Grid
                className={classes.content}
                container
                spacing={2}
            >
                <Grid item xs={12}>
                    <Typography className={classes.title} variant="h5">
                        Nuevo producto
                    </Typography>
                </Grid>
                <FormProduct
                    existencia={existencia}
                    formik={formik}
                    isValidTextField={isValidTextField}
                    nombre={nombre}
                    precio={precio}
                />
            </Grid>
            {state.errorMessage &&
                <Grid className={classes.alert} item xs={12}>
                    <Alert severity={state.errorStatus}>
                        {state.errorMessage}
                    </Alert>
                </Grid>
            }
        </form>
    );
}

export default NewProduct;