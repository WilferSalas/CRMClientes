import {
    ACTUALIZAR_TOTAL,
    CANTIDAD_PRODUCTO,
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO
} from '../../types';

export default (state, action) => {
    switch(action.type) {
        case SELECCIONAR_CLIENTE:
            return { ...state, clients: action.payload }
        case SELECCIONAR_PRODUCTO:
            return { ...state, products: action.payload }
        case CANTIDAD_PRODUCTO:
            return {
                ...state,
                products: state.products
                    .map(product => product.id === action.payload.id
                        ? product = action.payload
                        : product = product)
            }
        case ACTUALIZAR_TOTAL:
            return {
                ...state,
                total: state.products
                    .reduce((newTotal, product) => newTotal += product.precio * product.cantidad, 0)
            }
        default:
            return state;
    }
}