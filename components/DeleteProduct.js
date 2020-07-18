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
const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      nombre
      existencia
      precio
    }
  }
`;

const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!) {
    eliminarProducto(id: $id)
  }
`;

const Delete = ({ id }) => {
    const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            const { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS
            });

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: { obtenerProductos: obtenerProductos.filter(producto => producto.id !== id) }
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
                    const { data } = await eliminarProducto({
                        variables: {
                            id: idDelete
                        }
                    });

                    MySwal.fire({
                        title: 'Eliminado',
                        text: data.eliminarProducto,
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