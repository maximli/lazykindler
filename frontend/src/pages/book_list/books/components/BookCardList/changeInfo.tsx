import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

type ChangeInfoProp = {
    title: string;
    allowEmptyStr: boolean;
    handleClose: any;
    handleOK: any;
    open: boolean;
};

export default function ChangeInfo(prop: ChangeInfoProp) {
    const { title, allowEmptyStr, handleClose, handleOK, open } = prop;

    const [value, setValue] = React.useState<any>(null);

    const handleClickOk = () => {
        if (allowEmptyStr == false && value == null) {
            return;
        }
        handleOK(value);
        handleClose();
    };

    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="alert-dialog-title">{`${title}`}</DialogTitle>
                <DialogContent style={{ height: 170, paddingTop: 45 }}>
                    <TextField
                        id="outlined-basic"
                        label="新值"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        取消
                    </Button>
                    <Button
                        onClick={() => {
                            handleClickOk();
                        }}
                        autoFocus
                    >
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
