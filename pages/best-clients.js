// @packages
import Grid from '@material-ui/core/Grid';
import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import numeral from 'numeral';
import { ResponsiveBar } from '@nivo/bar'
import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';

// @apollo
const OBTENER_MEJORES_CLIENTES = gql`
    query mejoresClientes {
        mejoresClientes {
            total
            cliente {
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

const BestClients = () => {
    const classes = useStyles();

    const { data, loading, startPolling, stopPolling } = useQuery(OBTENER_MEJORES_CLIENTES);

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

    const { mejoresClientes } = data;

    const pieChartData = mejoresClientes.length ? {
        data: mejoresClientes.map(item => ({
            [item.cliente[0].nombre]: item.total,
            fullName: getNameInitials(`${item.cliente[0].nombre} ${item.cliente[0].apellido}`)
        })),
        keys: mejoresClientes.map(item => item.cliente[0].nombre)
    } : { data: [], keys: [] };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography className={classes.title} variant="h5">
                    Mejores clientes
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
                    colors={{ scheme: 'paired' }}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Clientes',
                        legendPosition: 'middle',
                        legendOffset: 40
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Compras',
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

export default BestClients;