import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { theme } from '../theme';
import AlertWrap from '../components/commonSnackbar';
import 'simplebar/dist/simplebar.min.css';
import LoadingDlg from 'src/components/loading';

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <AlertWrap>
        <LoadingDlg>
          <Head>
            <title>
              M-Demo Pro
            </title>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
              {/* <Box sx={{ width: "100%", position: "relative" }}>
              </Box> */}
              <CssBaseline />
              {getLayout(<Component {...pageProps} />)}

            </ThemeProvider>
          </LocalizationProvider>
        </LoadingDlg>
      </AlertWrap>
    </CacheProvider >
  );
};

export default App;
