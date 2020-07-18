// @packages
import List from '@material-ui/core/List';
import OrderContext from '../../context/orders/OrderContext';
import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// @scripts
import ProductSumary from './ProductSumary';

//@styles
const useStyles = makeStyles({
    noProducts: {
        margin: 30,
        textAlign: 'center'
    }
});

const OrderSumary = () => {
    const classes = useStyles();

    const orderContext = useContext(OrderContext);

    const { products } = orderContext;

    return (
        <>
            <Typography gutterBottom>
                3. Ajusta las cantidades del producto
            </Typography>
            {(products && products.length > 0)
                ? (<>
                    {products.map((product, index) => (
                        <List key={index}>
                            <ProductSumary
                                product={product}
                            />
                        </List>
                    ))}
                </>)
                : (<Typography className={classes.noProducts} gutterBottom>
                    No hay productos
                </Typography>)
            }
        </>
    );
}

export default OrderSumary;