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

// @apollo
const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput) {
        autenticarUsuario(input: $input) {
            token
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
        width: 400
    },
    errorText: {
        color: 'red'
    },
    formControl: {
        '& .MuiFormLabel-root.Mui-focused': {
            paddingRight: 10,
            width: 300
        }
    },
    input: {
        width: 400
    },
    message: {
        position: 'absolute',
        top: 400,
        width: 750
    },
    register: {
        alignItems: 'baseline',
        display: 'flex',
        justifyContent: 'center'
    },
    registerLink: {
        color: theme.palette.primary.main,
        fontSize: 16,
        marginLeft: 5
    },
    title: {
        color: theme.palette.primary.main,
        fontSize: 40,
        fontWeight: 600,
        margin: 10,
        textAlign: 'center'
    }
}));

const IniciarSesion = () => {
    const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

    const classes = useStyles();

    const [state, setState] = useState({
        errorMessage: '',
        errorStatus: '',
        showPassword: false
    });

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('El correo debe ser valido')
                .required('El correo es obligatorio'),
            password: Yup.string().required('El contraseña es obligatoria')
        }),
        onSubmit: async values => {
            const {
                email,
                password
            } = values;

            try {
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });

                setState({
                    errorMessage: 'Bienvenido de nuevo',
                    errorStatus: 'success'
                });

                setTimeout(() => {
                    setState({ errorMessage: null, errorStatus: '' });
                    router.push('/');
                }, 2000);

                const { token } = data.autenticarUsuario;
                localStorage.setItem('token', token);
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
        email,
        password
    } = formik.values;

    return (
        <form
            autoComplete="off"
            noValidate
            onSubmit={formik.handleSubmit}
        >
            <Grid className={classes.content} container spacing={2}>
                <Grid item xs={12}>
                    <Typography className={classes.title} variant="h5">
                        Iniciar sesion
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        className={classes.input}
                        error={isValidTextField('email')}
                        helperText={isValidTextField('email')
                            ? formik.errors.email :
                            ''
                        }
                        id="email"
                        label="Correo"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={email}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl className={classes.formControl} variant="outlined">
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
                        Iniciar sesion
                    </Button>
                </Grid>
                <Grid
                    className={classes.register}
                    item
                    xs={12}
                >
                    <Typography>
                        ¿No tienes una cuenta?
                    </Typography>
                    <Typography className={classes.root}>
                        <Link className={classes.registerLink} href="/register">
                            Registrate
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

export default IniciarSesion;