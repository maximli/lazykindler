import { deleteAllBooks, deleteAllClipping, downloadAllBooks, uploadBooks } from '@/services';
import { PageContainer } from '@ant-design/pro-layout';
import { FmdBadTwoTone } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem,
} from '@mui/material';
import { Input, Space } from 'antd';
import { Alert, Card } from 'antd';
import React, { useState } from 'react';

const { Search } = Input;

const Welcome: React.FC = () => {
    const [deleteType, setDeleteType] = useState<number>(0);
    const [deleteDialog, setDeleteDialog] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const onUploadFiles = (filepath: any) => {
        uploadBooks(filepath)
    };

    return (
        <PageContainer>
            <Card>
                <Alert
                    message={
                        '正在积极添加新功能，欢迎提issue，github地址: https://github.com/leowucn/lazykindler。'
                    }
                    type="success"
                    showIcon
                    banner
                    style={{
                        margin: -12,
                        marginBottom: 24,
                    }}
                />

                <Search
                    style={{ width: 800, float: 'left' }}
                    placeholder="请粘贴将要上传文件的路径或目录路径。如果是多个文件，用分号拼接!"
                    allowClear
                    size="large"
                    onSearch={onUploadFiles}
                    enterButton={<Button variant="contained">上传</Button>}
                />

                <div style={{ float: 'right' }}>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        其他操作
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                downloadAllBooks()
                                setAnchorEl(null);
                            }}
                        >
                            下载所有书籍
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setDeleteDialog(true);
                                setDeleteType(1);
                            }}
                        >
                            删除书籍
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setDeleteDialog(true);
                                setDeleteType(2);
                            }}
                        >
                            删除摘抄
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setDeleteDialog(true);
                                setDeleteType(3);
                            }}
                        >
                            删除所有
                        </MenuItem>
                    </Menu>
                </div>

                <div>
                    <Dialog
                        open={deleteDialog}
                        onClose={handleCloseDeleteDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        fullWidth
                    >
                        <DialogTitle id="alert-dialog-title">警告</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                确定删除吗
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    handleCloseDeleteDialog();
                                    handleClose();
                                }}
                                autoFocus
                            >
                                取消
                            </Button>
                            <Button
                                onClick={() => {
                                    handleCloseDeleteDialog();
                                    handleClose();

                                    if (deleteType === 1) {
                                        deleteAllBooks();
                                    } else if (deleteType === 2) {
                                        deleteAllClipping();
                                    } else {
                                        deleteAllBooks();
                                        deleteAllClipping();
                                    }
                                }}
                            >
                                确定
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </Card>
        </PageContainer>
    );
};

export default Welcome;
