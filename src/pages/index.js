import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';


const Dashboard = () => (
  <>
    <Head>
      <title>
        Dashboard | M-Demo
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>

      </Container>
    </Box>
  </>
);

Dashboard.getLayout = (page) => {
  return (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
}

export default Dashboard;
