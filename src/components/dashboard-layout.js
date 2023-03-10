import { useEffect, useState } from 'react';
import { Box, CircularProgress, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { handleAuthSSR } from 'src/utils/auth';
import { useRouter } from 'next/router';
import { publicRequest } from '../utils/requestMethods';
import { alertObj } from './commonSnackbar';

const DashboardLayoutRoot = styled('div')(({ theme, left }) => ({
  transition: "all 300ms cubic-bezier(0, 0, 0.2, 1) 0ms",
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: left
  }
}));

const limitDate = "";

export const DashboardLayout = (props) => {

  // if(){

  // }
  const { children } = props;
  const [permissions, setPermissions] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarType, setSidebarType] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const router = useRouter();

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarWidth(280);
    } else {
      setSidebarWidth(0);
    }
  }, [isSidebarOpen])

  useEffect(() => {
    router.events.on("routeChangeComplete", async () => {
      console.log("route change routeChangeComplete");
      initPermissions();
    });
    return () => {
      router.events.off("routeChangeComplete", () => {
        console.log("stoped");
      });
    };
  }, [router.events]);

  useEffect(() => {
    initPermissions();
  }, [])


  const initPermissions = async () => {
    const result = await handleAuthSSR(permissions);
    if (!result || !result.permissions) {
      return;
    }
    setPermissions(result.permissions);

  }


  if (!Array.isArray(permissions) || permissions.length == 0) {
    return <Container sx={{width:"100%", height: "100vh", display:"flex", justifyContent:"center", alignItems:"center" }} fixed>
      <CircularProgress />
    </Container>
  }

  return (
    <>
      <DashboardLayoutRoot left={sidebarWidth}>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar isSidebarOpen={isSidebarOpen} left={sidebarWidth} onSidebarOpen={() => setSidebarOpen(!isSidebarOpen)} />
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
        sidebarType={sidebarType}
        permissions={permissions}
      />
    </>
  );
};
