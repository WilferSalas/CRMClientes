// @packages
import * as Yup from 'yup';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { gql, useQuery, useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import { useRouter } from 'next/router';

// @scripts
import FormProduct from '../../components/FormProduct';

// @apollo
const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            nombre
            existencia
            precio
        }
    }
`

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            id
        }
    }
`;

//@styles
const useStyles = makeStyles((theme) => ({
    content: {
        margin: '0px 10px 5px 0px',
        paddingRight: 15,
        paddingLeft: 5,
        width: '100%'
    },
    loading: {
        left: '50%',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    },
    title: {
        color: theme.palette.primary.main
    }
}));

const EditProduct = () => {
    const [state, setState] = useState({
        errorMessage: '',
        errorStatus: '',
        showPassword: false
    });

    const router = useRouter();

    const { query: { id } } = router;

    const { data, loading } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    const [ actualizarProducto ] = useMutation(ACTUALIZAR_PRODUCTO);

    const schemaValidation = Yup.object({
        existencia: Yup.string().required('La cantidad es requerida es obligatoria'),
        nombre: Yup.string().required('El nombre es obligatoria'),
        precio: Yup.string().required('El precio es obligatoria')
    });

    const classes = useStyles();

    if (loading) return null;

    const handleOnEdit = async (values) => {
        const {
            existencia,
            nombre,
            precio
        } = values;

        try {
            await actualizarProducto({
                variables: {
                    id,
                    input: {
                        existencia,
                        nombre,
                        precio
                    }
                }
            });

            setState({
                errorMessage: 'Producto actualizado',
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

    const Content = ({ props }) => {
        const isValidTextField = (id) => {
            if (Boolean(props.touched[id] && props.errors[id])) {
                return true;
            }

            return false;
        };

        const {
            existencia,
            nombre,
            precio
        } = props.values;

        return (
            <form
                autoComplete="off"
                noValidate
                onSubmit={props.handleSubmit}
            >
                <Grid
                    className={classes.content}
                    container
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <Typography className={classes.title} variant="h5">
                            Editar cliente
                        </Typography>
                    </Grid>
                    <FormProduct
                        existencia={existencia}
                        formik={props}
                        isValidTextField={isValidTextField}
                        nombre={nombre}
                        precio={precio}
                    />
                    {state.errorMessage &&
                        <Grid item xs={12}>
                            <Alert severity={state.errorStatus}>
                                {state.errorMessage}
                            </Alert>
                        </Grid>
                    }
                </Grid>
            </form>
        );
    }

    return (
        <Formik
            enableReinitialize
            initialValues={data.obtenerProducto}
            onSubmit={values => handleOnEdit(values)}
            validationSchema={schemaValidation}
        >
            {props => {
                return (
                    <Content props={props} />
                )
            }}
        </Formik>
    );
}

export default EditProduct;