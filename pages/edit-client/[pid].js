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
import FormClient from '../../components/FormClient';

// @apollo
const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!) {
        obtenerCliente(id: $id) {
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput) {
        actualizarCliente(id: $id, input: $input) {
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

const EditClient = () => {
    const [state, setState] = useState({
        errorMessage: '',
        errorStatus: '',
        showPassword: false
    });

    const router = useRouter();

    const { query: { id } } = router;

    const { data, loading } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });

    const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLIENTE);

    const schemaValidation = Yup.object({
        apellido: Yup.string().required('El apellido es obligatoria'),
        email: Yup.string().email('El correo debe ser valido')
            .required('El correo es obligatorio'),
        nombre: Yup.string().required('El nombre es obligatoria'),
        empresa: Yup.string().required('El nombre es obligatoria')
    });

    const classes = useStyles();

    if (loading) return null;

    const handleOnEdit = async (values) => {
        const {
            apellido,
            email,
            empresa,
            nombre,
            telefono
        } = values;

        try {
            await actualizarCliente({
                variables: {
                    id,
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
                errorMessage: 'Cliente actualizado',
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
    };

    const Content = ({ props }) => {
        const isValidTextField = (id) => {
            if (Boolean(props.touched[id] && props.errors[id])) {
                return true;
            }

            return false;
        };

        const {
            apellido,
            email,
            empresa,
            nombre,
            telefono
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
                    <FormClient
                        apellido={apellido}
                        email={email}
                        empresa={empresa}
                        formik={props}
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

    return (
        <Formik
            enableReinitialize
            initialValues={data.obtenerCliente}
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

export default EditClient;