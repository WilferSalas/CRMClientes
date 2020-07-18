// @packages
import Grid from '@material-ui/core/Grid';
import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import OrderContext from '../../context/orders/OrderContext';
import numeral from 'numeral';
import { makeStyles } from '@material-ui/core/styles';

//@styles
const useStyles = makeStyles({
    total: {
        color: 'white'
    },
    totalValue: {
        textAlign: 'end'
    }
});

const Total = () => {
    const classes = useStyles();

    const orderContext = useContext(OrderContext);

    const { total } = orderContext;

    return (
        <Grid className={classes.total} container>
            <Grid item xs={6}>
                <Typography>
                    Total a pagar
                </Typography>
            </Grid>
            <Grid
                className={classes.totalValue}
                item
                xs={6}
            >
                <Typography>
                    {numeral(total).format('($ 0,0)')}
                </Typography>
            </Grid>
        </Grid>
    );
}

export default Total;