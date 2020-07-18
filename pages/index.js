// @packages
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Loader from 'react-loader-spinner';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import theme from '../src/theme';
import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

// @scripts
import Delete from '../components/DeleteClient';
import Edit from '../components/EditClient';

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

const useStyles = makeStyles((theme) => ({
  buttonNewClient: {
    margin: '0 10px 10px 0px',
    textAlign: 'end'
  },
  loading: {
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  table: {
    margin: '0 10px'
  },
  tableCell: {
    color: 'white'
  },
  tableHead: {
    background: theme.palette.primary.main,
  },
  title: {
    color: theme.palette.primary.main,
    margin: 10
  }
}));

const Index = () => {
  const classes = useStyles();

  const { data, loading } = useQuery(OBTENER_CLIENTES_USUARIO);

  const router = useRouter();

  if (loading) return null;

  if (!data.obtenerClientesVendedor) {
      return router.push('/login');
  };

  const Loading = () => (
    <Loader
        className={classes.loading}
        type="Puff"
        color={theme.palette.primary.main}
        height={100}
        width={100}
      />
  );

  const Content = () => (
    <Grid container>
      <Grid item xs={12}>
        <Typography className={classes.title} variant="h5">
            Clientes
        </Typography>
      </Grid>
      <Grid className={classes.buttonNewClient} item xs={12}>
        <Button
          color="primary"
          onClick={() => router.push('/new-client')}
          variant="contained"
        >
          Crear nuevo cliente
        </Button>
      </Grid>
      <Grid className={classes.table} item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableCell}>Acciones</TableCell>
                <TableCell className={classes.tableCell}>Nombre</TableCell>
                <TableCell className={classes.tableCell}>Empresa</TableCell>
                <TableCell className={classes.tableCell}>Correo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.obtenerClientesVendedor.map((row, index) => (
                <TableRow key={`${row.id}-${index}`}>
                    <TableCell>
                        <Edit id={row.id} />
                        <Delete id={row.id} />
                    </TableCell>
                    <TableCell>{row.nombre} {row.apellido}</TableCell>
                    <TableCell>{row.empresa}</TableCell>
                    <TableCell>{row.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )

  return (
    <div>
        {loading
          ? <Loading />
          : <Content />
        }
    </div>
  );
}

export default Index;