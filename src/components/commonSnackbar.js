import React, { useEffect, useState } from 'react';
import {
  Alert,
  Snackbar,
} from '@mui/material';
import { AlertColor } from '@mui/material/Alert';

export const alertObj = {
  show (msg, type) {}
}

let key = 0;
 const AlertWrap = ({children}) => {
  const [alertList, setAlertList] = useState([]);
  const msgs = (msg) =>{
    if(!msg){
      return "";
    }
    return (
      msg.split(",").map((each)=>{
        return (<div>{each}</div>)
      })
    )
  }

  useEffect(() => {
    alertObj.show = (msg, type) => {
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') return ;    
        setAlertList(alertList => ([]));
      }
      const node = (
        <Snackbar open={true}  autoHideDuration={6000} onClose={handleClose} key={++key} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert
            key={'alert' + key}
            onClose={handleClose}
            elevation={6}
            variant="filled"
            severity={type || 'success'}
          >
            <div>
            {msgs(msg)}
            </div>
            
            
          </Alert>
        </Snackbar>
      );
      setAlertList(alertList => ([...alertList, node]));
    };
  }, []);

  return (
    <>
      {alertList}
      {children}
    </>
  )
}

export default AlertWrap;
