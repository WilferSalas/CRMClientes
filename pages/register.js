// @packges
import * as Yup from 'yup';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const REGISTRAR_USUARIO = gql`
    mutation nuevoUsuario($input: UsuarioInput) {
        nuevoUsuario(input: $input) {
            id
            nombre
            apellido
            email
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: 20,
        textAlign: 'center'
    },
    content: {
        left: '50%',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 650
    },
    errorText: {
        color: 'red'
    },
    input: {
        width: 300
    },
    inputFullWidth: {
        width: 625
    },
    logIn: {
        alignItems: 'baseline',
        display: 'flex',
        justifyContent: 'center'
    },
    loginLink: {
        color: theme.palette.primary.main,
        fontSize: 16,
        marginLeft: 5
    },
    message: {
        position: 'absolute',
        top: 500,
        width: 750
    },
    title: {
        color: theme.palette.primary.main,
        fontSize: 40,
        fontWeight: 600,
        margin: 10,
        textAlign: 'center'
    }
}));

const Registrar = () => {
    const [ nuevoUsuario ] = useMutation(REGISTRAR_USUARIO);

    const classes = useStyles();

    const [state, setState] = useState({
        errorMessage: '',
        errorStatus: '',
        showPassword: false
    });

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            apellido: '',
            email: '',
            nombre: '',
            password: '',
            repeatPassword: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            email: Yup.string().email('El correo debe ser valido')
                .required('El correo es obligatorio'),
            password: Yup.string().required('El contraseña es obligatoria')
                .min(6, 'Minimo 6 caracteres'),
            repeatPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Las contraseña no coinciden')
        }),
        onSubmit: async values => {
            const {
                nombre,
                apellido,
                email,
                password
            } = values;

            try {
                const { data } = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                });

                setState({
                    errorMessage: `Se creo correctamente el usuario ${data.nuevoUsuario.nombre}`,
                    errorStatus: 'success'
                });

                setTimeout(() => {
                    setState({ errorMessage: null, errorStatus: '' });
                    router.push('/login')
                }, 2000);
            } catch (error) {
                setState({ errorMessage: error.message, errorStatus: 'warning' });

                setTimeout(() => {
                    setState({ errorMessage: null, errorStatus: '' });
                }, 3000);
            }
        }
    });

    const handleClickShowPassword = () => {
        setState({ ...state, showPassword: !state.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const isValidTextField = (id) => {
        if (Boolean(formik.touched[id] && formik.errors[id])) {
            return true;
        }

        return false;
    };

    const {
        apellido,
        email,
        nombre,
        password,
        repeatPassword
    } = formik.values;

    return (
        <form
            autoComplete="off"
            noValidate
            onSubmit={formik.handleSubmit}
        >
            <Grid className={classes.content} container spacing={3}>
                <Grid item xs={12}>
                    <Typography className={classes.title} variant="h5">
                        Registrarse
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        className={classes.input}
                        error={isValidTextField('nombre')}
                        helperText={isValidTextField('nombre')
                            ? formik.errors.nombre :
                            ''
                        }
                        id="nombre"
                        label="Nombre"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={nombre}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        className={classes.input}
                        error={isValidTextField('apellido')}
                        helperText={isValidTextField('apellido')
                            ? formik.errors.apellido
                            : ''
                        }
                        id="apellido"
                        label="Apellido"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={apellido}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        className={classes.inputFullWidth}
                        error={isValidTextField('email')}
                        helperText={isValidTextField('email')
                            ? formik.errors.email :
                            ''
                        }
                        id="email"
                        label="Correo"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="email"
                        value={email}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="password">Contraseña</InputLabel>
                        <OutlinedInput
                            className={classes.input}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                        {state.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            error={isValidTextField('password')}
                            id="password"
                            labelWidth={70}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type={state.showPassword ? 'text' : 'password'}
                            value={password}
                        />
                        {Boolean(formik.errors.password) &&
                            <FormHelperText className={classes.errorText} id="password">
                                {isValidTextField('password')
                                    ? formik.errors.password :
                                    ''}
                            </FormHelperText>
                        }
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="repeatPassword">Repetir contraseña</InputLabel>
                        <OutlinedInput
                            className={classes.input}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                        {state.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            error={isValidTextField('repeatPassword')}
                            id="repeatPassword"
                            labelWidth={70}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type={state.showPassword ? 'text' : 'password'}
                            value={repeatPassword}
                        />
                        {Boolean(formik.errors.repeatPassword) &&
                            <FormHelperText className={classes.errorText} id="password">
                                {isValidTextField('repeatPassword')
                                    ? formik.errors.repeatPassword :
                                    ''}
                            </FormHelperText>
                        }
                    </FormControl>
                </Grid>
                <Grid
                    className={classes.button}
                    item
                    xs={12}
                >
                    <Button
                        color="primary"
                        onClick={formik.handleSubmit}
                        variant="contained"
                    >
                        Registrarse
                    </Button>
                </Grid>
                <Grid
                    className={classes.logIn}
                    item
                    xs={12}
                >
                    <Typography>
                        ¿Ya tienes una cuenta?
                    </Typography>
                    <Typography className={classes.root}>
                        <Link className={classes.loginLink} href="/login">
                            Inicia sesion
                        </Link>
                    </Typography>
                </Grid>
                {state.errorMessage &&
                    <Grid className={classes.message} item xs={12}>
                        <Alert severity={state.errorStatus}>
                            {state.errorMessage}
                        </Alert>
                    </Grid>
                }
            </Grid>
        </form>
    );
}

export default Registrar;