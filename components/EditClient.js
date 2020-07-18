// @packages
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import Router from 'next/router';
import Tooltip from '@material-ui/core/Tooltip';

const Edit = ({ id }) => {
    const handleOnEdit = () => {
        Router.push({
            pathname: "/edit-client/[id]",
            query: { id }
        });
    };

    return (
        <Tooltip title="Editar">
            <IconButton color="primary" onClick={() => handleOnEdit(id)}>
                <EditIcon />
            </IconButton>
        </Tooltip>
    );
}

export default Edit;