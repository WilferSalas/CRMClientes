// @packages
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import OrderContext from '../../context/orders/OrderContext';
import React, { useContext, useEffect, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import numeral from 'numeral';
import { makeStyles } from '@material-ui/core/styles';

//@styles
const useStyles = makeStyles({
    secondaryAction: {
        marginRight: 30,
        width: 200
    },
    secondaryActionPrice: {
        marginRight: 30
    }
});

const ProductSumary = ({ product }) => {
    const [state, setState] = useState({
        value: 0
    });

    useEffect(() => {
        updateQuantity();
        updateTotal();
    }, [state.value])

    const orderContext = useContext(OrderContext);

    const { productQuantity, updateTotal } = orderContext;

    const classes = useStyles();

    const updateQuantity = () => {
        const newProduct = { ...product, cantidad: state.value };

        productQuantity(newProduct);
     };

    const handleOnChange = (event, value) => {
        setState({
            value
        });
    };

    const { nombre, precio, id, existencia } = product;

    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: existencia,
            label: `${existencia} unidades`,
        },
    ];

    return (
        <ListItem key={id}>
            <ListItemText primary={nombre} secondary={numeral(precio).format('($ 0,0)')} />
            <ListItemSecondaryAction className={classes.secondaryAction}>
                <Slider
                    value={state.value}
                    defaultValue={0}
                    aria-labelledby="discrete-slider-always"
                    step={1}
                    max={existencia}
                    marks={marks}
                    onChange={handleOnChange}
                    valueLabelDisplay="on"
                />
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default ProductSumary;