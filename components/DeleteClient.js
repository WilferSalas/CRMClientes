// @packages
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import Swal from 'sweetalert2'
import Tooltip from '@material-ui/core/Tooltip';
import theme from '../src/theme';
import withReactContent from 'sweetalert2-react-content'
import { gql, useMutation } from '@apollo/client';

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

const ELIMINAR_CLIENTE = gql`
  mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`;

const Delete = ({ id }) => {
    const [ eliminarCliente ] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            const { obtenerClientesVendedor } = cache.readQuery({
                query: OBTENER_CLIENTES_USUARIO
            });

            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: { obtenerClientesVendedor: obtenerClientesVendedor.filter(cliente => cliente.id !== id) }
            });
        }
    });

    const MySwal = withReactContent(Swal);

    const handleOnDelete = (idDelete) => {
        MySwal.fire({
            title: ' ¿Estas seguro de esto?',
            text: 'Este cambio no se puede revertir',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: theme.palette.primary.main,
            cancelButtonColor: theme.palette.primary.main,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
       }).then( async (result) => {
            if(result.value){
                try {
                    const { data } = await eliminarCliente({
                        variables: {
                            id: idDelete
                        }
                    });

                    MySwal.fire({
                        title: 'Eliminado',
                        text: data.eliminarCliente,
                        icon: 'success',
                        confirmButtonColor: theme.palette.primary.main
                    });
                } catch (error) {
                    MySwal.fire(
                        error.message,
                        'error'
                    );
                }
            }
        })
      };

    return (
        <Tooltip title="Borrar">
            <IconButton color="primary" onClick={() => handleOnDelete(id)}>
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    );
}

export default Delete;