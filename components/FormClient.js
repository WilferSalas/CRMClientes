// @packages
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

//@styles
const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: 20,
        textAlign: 'center'
    }
}));

const FormClient = ({
    apellido,
    email,
    empresa,
    formik,
    isValidTextField,
    nombre,
    telefono
}) => {
    const classes = useStyles();

    return (
        <>
            <Grid item xs={6}>
                <TextField
                    error={isValidTextField('nombre')}
                    fullWidth
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
                    error={isValidTextField('apellido')}
                    fullWidth
                    helperText={isValidTextField('apellido')
                        ? formik.errors.apellido :
                        ''
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
                    error={isValidTextField('email')}
                    fullWidth
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
            <Grid item xs={6}>
                <TextField
                    error={isValidTextField('empresa')}
                    fullWidth
                    helperText={isValidTextField('empresa')
                        ? formik.errors.empresa :
                        ''
                    }
                    id="empresa"
                    label="Empresa"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={empresa}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    id="telefono"
                    label="Telefono"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={telefono}
                    variant="outlined"
                />
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
                    Agregar cliente
                </Button>
            </Grid>
        </>
     );
};

FormClient.propTypes = {
    apellido: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    empresa: PropTypes.string.isRequired,
    formik: PropTypes.object.isRequired,
    isValidTextField: PropTypes.func.isRequired,
    nombre: PropTypes.string.isRequired,
    telefono: PropTypes.string.isRequired
};

export default FormClient;