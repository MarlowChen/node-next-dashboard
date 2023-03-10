import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';



export const ConfirmationDialog = (props) => {
    const { title, onClose, open, children, onConfirm, formId,  ...other } = props;

    const handleEntering = () => {

    };

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onConfirm();
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}

        >
            <DialogTitle>{title ? title : "Confirm"}</DialogTitle>
            <DialogContent >
                <form id={formId? formId : "confirmform"}  onSubmit={onConfirm}>
                    {children}
                </form>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button type="submit" form={formId? formId : "confirmform"} >Save</Button>
            </DialogActions>

        </Dialog>
    );
}

ConfirmationDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};