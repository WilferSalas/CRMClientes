// @packages
import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    createHttpLink
} from '@apollo/client';
import { setContext } from 'apollo-link-context';
import fetch from 'node-fetch';

const httpLink = createHttpLink({
    uri: 'https://hidden-brook-04275.herokuapp.com/',
    fetch
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client;