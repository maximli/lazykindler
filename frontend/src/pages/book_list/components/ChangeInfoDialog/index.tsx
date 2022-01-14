import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

type ChangeInfoProp = {
    title: string;
    oldValue: any;
    allowEmptyStr: boolean;
    handleClose: any;
    handleOK: any;
    open: boolean;
};

export default function ChangeInfo(prop: ChangeInfoProp) {
    const { title, allowEmptyStr, handleClose, handleOK, open, oldValue } = prop;

    const [value, setValue] = React.useState<any>(oldValue);

    const handleClickOk = () => {
        if (value == oldValue) {
            handleClose();
            return
        }
        if (allowEmptyStr == false && (value == null || value == "")) {
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
                        defaultValue={oldValue}
                        fullWidth
                        onChange={(e) => {
                            let newValue = e.target.value.trim();
                            setValue(newValue);
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
