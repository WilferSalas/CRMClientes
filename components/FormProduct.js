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

const FormProduct = ({
    existencia,
    formik,
    isValidTextField,
    nombre,
    precio
}) => {
    const classes = useStyles();

    return (
        <>
            <Grid item xs={12}>
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
                    error={isValidTextField('existencia')}
                    fullWidth
                    helperText={isValidTextField('existencia')
                        ? formik.errors.existencia :
                        ''
                    }
                    id="existencia"
                    label="Cantidad"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={existencia}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    error={isValidTextField('precio')}
                    fullWidth
                    helperText={isValidTextField('precio')
                        ? formik.errors.precio :
                        ''
                    }
                    id="precio"
                    label="Precio"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={precio}
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
                    Agregar producto
                </Button>
            </Grid>
        </>
     );
};

FormProduct.propTypes = {
    existencia: PropTypes.number.isRequired,
    formik: PropTypes.object.isRequired,
    isValidTextField: PropTypes.func.isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired
};

export default FormProduct;