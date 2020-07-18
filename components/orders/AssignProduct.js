// @packages
import OrderContext from '../../context/orders/OrderContext';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import { gql, useQuery } from '@apollo/client';

// @apollo
const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
        id
        nombre
        existencia
        precio
    }
  }
`;

const AssignClient = () => {
    const [state, setstate] = useState({
        product: []
    });

    const orderContext = useContext(OrderContext);

    const { selectProduct } = orderContext;

    const { data, loading } = useQuery(OBTENER_PRODUCTOS);

    useEffect(() => {
        selectProduct(state.product);
    }, [state.product]);

    const selectOptions = (product) => {
        setstate({
            product
        });
    }

    if (loading) return null;

    const { obtenerProductos } = data;

    return (
        <>
            <Typography gutterBottom>
                2. Selecciona o busca los productos
            </Typography>
            <Select
                getOptionLabel={options => options.nombre}
                getOptionValue={options => options.id}
                isMulti
                noOptionsMessage={() => "No hay resultados"}
                onChange={option => selectOptions(option)}
                options={obtenerProductos}
                placeholder="Seleccionar uno o varios  producto"
            />
        </>
    );
}

export default AssignClient;