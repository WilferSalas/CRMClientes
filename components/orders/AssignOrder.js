// @packages
import OrderContext from '../../context/orders/OrderContext';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import { gql, useQuery } from '@apollo/client';

// @apollo
const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
      telefono
      vendedor
    }
  }
`;

const AssignOrder = () => {
    const [state, setstate] = useState({
        client: []
    });

    const orderContext = useContext(OrderContext);

    const { selectClient } = orderContext;

    const { data, loading } = useQuery(OBTENER_CLIENTES_USUARIO);

    useEffect(() => {
        selectClient(state.client);
    }, [state.client]);

    const selectOptions = (client) => {
        setstate({
            client
        });
    }

    if (loading) return null;

    const { obtenerClientesVendedor } = data;

    return (
        <>
            <Typography gutterBottom>
                1. Asigna un cliente al pedido
            </Typography>
            <Select
                getOptionLabel={options => `${options.nombre} ${options.apellido}`}
                getOptionValue={options => options.id}
                onChange={option => selectOptions(option)}
                options={obtenerClientesVendedor}
                placeholder="Selecciona un cliente"
                noOptionsMessage={() => "No hay resultados"}
            />
        </>
    );
}

export default AssignOrder;