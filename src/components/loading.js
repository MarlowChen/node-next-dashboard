import { Box, Fade } from '@mui/material';
import React, { ReactElement, useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { makeStyles } from '@mui/styles';
import { Theme } from "@mui/system";

export const loadingObj = {
    showLoading(msg, loading) { }
}

const useStyles = makeStyles((theme) => ({
    root: {

    },
    loadingCls: {
        display: 'flex',
        height: '100vh',
        width: '100%',

        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        position: 'fixed',
        background: '#44444447'
    },
}))

const LoadingDlg = ({ children }) => {
    const classes = useStyles();

    const [loadingElement, setLoadingElement] = useState();
    useEffect(() => {
        loadingObj.showLoading = (msg, loading) => {
            const node = (
                <Fade className={classes.loadingCls} in={loading} >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            fontSize: '2rem',
                            margin: 'auto',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            zIndex: 1101,
                            background: '#00000085',
                            color: 'white',
                            height: '100%',
                            width: '100%',
                            justifyContent: 'center'
                        }}

                    >
                        <ReactLoading type='spinningBubbles' color='white' />
                        {msg}
                    </Box>
                </Fade>
            );
            setLoadingElement(node);
        };
    }, []);

    return (
        <>
            {children}

            {loadingElement}

        </>
    )
}

export default LoadingDlg;
