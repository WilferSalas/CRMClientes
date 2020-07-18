// @packages
import Grid from '@material-ui/core/Grid';
import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import numeral from 'numeral';
import { ResponsiveBar } from '@nivo/bar'
import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';

// @apollo
const OBTENER_MEJORES_VENDEDORES = gql`
    query mejoresVendedores {
        mejoresVendedores {
            total
            vendedor {
                nombre
                apellido
            }
        }
    }
`;

// @styles
const useStyles = makeStyles((theme) => ({
    bar: {
        height: 'calc(100vh - 120px)'
    },
    title: {
        color: theme.palette.primary.main,
        margin: 10
    }
}));

const BestSellers = () => {
    const classes = useStyles();

    const { data, loading, startPolling, stopPolling } = useQuery(OBTENER_MEJORES_VENDEDORES);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

    if (loading) return null;

    const getNameInitials = (str) => {
        if (!str) {
            return '';
        }

        const tokens = str.split(' ');
        let initials = tokens[0].substring(0, 1).toUpperCase();

        if (tokens.length === 2) {
            initials += tokens[1].substring(0, 1).toUpperCase();
        } else if (tokens.length >= 3) {
            initials += tokens[2].substring(0, 1).toUpperCase();
        }

        return initials;
    };

    const { mejoresVendedores } = data;

    const pieChartData = mejoresVendedores.length ? {
        data: mejoresVendedores.map(item => ({
            [item.vendedor[0].nombre]: item.total,
            fullName: getNameInitials(`${item.vendedor[0].nombre} ${item.vendedor[0].apellido}`)
        })),
        keys: mejoresVendedores.map(item => item.vendedor[0].nombre)
    } : { data: [], keys: [] };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography className={classes.title} variant="h5">
                    Mejores vendedores
                </Typography>
            </Grid>
            <Grid className={classes.bar} item xs={12}>
                <ResponsiveBar
                    data={pieChartData.data}
                    keys={pieChartData.keys}
                    labelFormat={value => numeral(value).format('($0,0)')}
                    tooltipFormat={value => numeral(value).format('($0,0)')}
                    indexBy="fullName"
                    margin={{ top: 50, right: 130, bottom: 60, left: 95 }}
                    padding={0.3}
                    colors={{ scheme: 'nivo' }}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Vendedores',
                        legendPosition: 'middle',
                        legendOffset: 40
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Ventas',
                        legendPosition: 'middle',
                        legendOffset: -75
                    }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </Grid>
        </Grid>
    );
}

export default BestSellers;