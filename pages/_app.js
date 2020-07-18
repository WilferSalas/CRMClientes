// @packages
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';
import client from '../config/apollo';
import theme from '../src/theme';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

// @scripts
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import OrderState from '../context/orders/OrderState';

export default function MyApp(props) {
    const { Component, pageProps } = props;

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');

        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    const router = useRouter();

    const isLoggedOut = (router.pathname !== '/login' && router.pathname !== '/register');

    return (
        <React.Fragment>
            <Head>
                <title>CRM</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <ApolloProvider client={client}>
                    {isLoggedOut &&
                        <>
                            <Sidebar />
                            <Header />
                        </>
                    }
                    <CssBaseline />
                    <main
                        style={isLoggedOut
                            ? { marginLeft: 240 }
                            : { marginLeft: 0 }}>
                            <OrderState>
                                <Component {...pageProps} />
                            </OrderState>
                    </main>
                </ApolloProvider>
            </ThemeProvider>
        </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};