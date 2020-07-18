// @packages
import * as Yup from 'yup';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

// @scripts
import FormClient from '../components/FormClient';

// @apollo
const NUEVO_CLIENTE = gql`
    mutation nuevoCliente ($input: ClienteInput) {
        nuevoCliente(input: $input) {
            id
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
      telefono
      vendedor
    }
  }
`

//@styles
const useStyles = makeStyles((theme) => ({
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

const NewCliet = () => {
    const [state, setState] = useState({
        errorMessage: '',
        errorStatus: '',
        showPassword: false
    });

    const router = useRouter();

    const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data: { nuevoCliente } }) {
            const { obtenerClientesVendedor } = cache.readQuery({
                query: OBTENER_CLIENTES_USUARIO
            });

            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: { obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente] }
            });
        }
    });

    const formik = useFormik({
        initialValues: {
            apellido: '',
            email: '',
            empresa: '',
            nombre: '',
            telefono: ''
        },
        validationSchema: Yup.object({
            apellido: Yup.string().required('El apellido es obligatoria'),
            email: Yup.string().email('El correo debe ser valido')
                .required('El correo es obligatorio'),
            nombre: Yup.string().required('El nombre es obligatoria'),
            empresa: Yup.string().required('El nombre es obligatoria')
        }),
        onSubmit: values => handleOnCreate(values)
    });

    const handleOnCreate = async (values) => {
        const {
            apellido,
            email,
            empresa,
            nombre,
            telefono
        } = values;

        try {
            await nuevoCliente({
                variables: {
                    input: {
                        apellido,
                        email,
                        empresa,
                        nombre,
                        telefono
                    }
                }
            });

            setState({
                errorMessage: 'Cliente agregado',
                errorStatus: 'success'
            });

            setTimeout(() => {
                setState({ errorMessage: null, errorStatus: '' });
                router.push('/');
            }, 2000);
        } catch (error) {
            setState({ errorMessage: error.message, errorStatus: 'warning' });

            setTimeout(() => {
                setState({ errorMessage: null, errorStatus: '' });
            }, 3000);
        }
    }

    const isValidTextField = (id) => {
        if (Boolean(formik.touched[id] && formik.errors[id])) {
            return true;
        }

        return false;
    };

    const classes = useStyles();

    const {
        apellido,
        email,
        empresa,
        nombre,
        telefono
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
                        Nuevo cliente
                    </Typography>
                </Grid>
                <FormClient
                    apellido={apellido}
                    email={email}
                    empresa={empresa}
                    formik={formik}
                    isValidTextField={isValidTextField}
                    nombre={nombre}
                    telefono={telefono}
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

export default NewCliet;