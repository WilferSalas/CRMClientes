// @packages
import React, { useReducer } from 'react';
import OrderContext from './OrderContext';
import OrderReducer from './OrderReducer';

// @scripts
import {
    ACTUALIZAR_TOTAL,
    CANTIDAD_PRODUCTO,
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO
} from '../../types';

const OrderState = ({ children }) => {
    const initialState = {
        clients: {},
        products: [],
        total: 0
    };

    const [state, dispatch] = useReducer(OrderReducer, initialState);

    const selectClient = client => {
        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: client
        });
    };

    const selectProduct = product => {
        let newState;

        if (state.products && state.products.length > 0) {
            newState = product.map(item => {
                const newObject = state.products
                    .find(productState => productState.id === item.id)

                return { ...item, ...newObject }
            });
        } else {
            newState = product;
        }

        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: newState
        });
    };

    const productQuantity = newProductQuantity => {
        dispatch({
            type: CANTIDAD_PRODUCTO,
            payload: newProductQuantity
        });
    };

    const updateTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL
        });
    };

    return (
        <OrderContext.Provider
            value={{
                clients: state.clients,
                productQuantity,
                products: state.products,
                selectClient,
                selectProduct,
                total: state.total,
                updateTotal
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}

export default OrderState;