import { Card, List as AntList } from 'antd';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import _ from 'lodash';
import Cover from '../../../components/Cover';

import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { withStyles } from '@material-ui/core/styles';
import { BookMetaDataType } from '../../../../data';
import ChangeInfo from '../../../components/ChangeInfoDialog';
import { useState } from 'react';
import { updateBookMeta, deleteBook } from '@/services';

const { SubMenu } = Menu;

const RedTextTypography = withStyles({
    root: {
        color: '#f44336',
    },
})(Typography);

type BookCardListProps = {
    data: any;
    fetchBooks: any;
};

const initialDialogInfo = {
    title: '',
    allowEmptyStr: false,
    handleOK: null,
    open: false,
};

export default function BookCardList(props: BookCardListProps) {
    const { data, fetchBooks } = props;

    const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);
    const [openDeleteBook, setOpenDeleteBook] = useState(false);
    const [deleteBookUUID, setDeleteBookUUID] = useState('');

    const handleCloseDialog = () => {
        setDialogInfo(initialDialogInfo);
    };

    const handleClickOpen = (uuid: string) => {
        setDeleteBookUUID(uuid);
        setOpenDeleteBook(true);
    };

    const handleClose = () => {
        setOpenDeleteBook(false);
    };


    return (
        <div style={{ paddingLeft: 5 }}>
            <div style={{ height: "82vh", overflow: 'auto' }}>
                <AntList<any>
                    style={{ width: "70vw" }}
                    rowKey="id"
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 5,
                        xxl: 6,
                    }}
                    pagination={{
                        position: 'bottom',
                        defaultPageSize: 40,
                        hideOnSinglePage: true,
                        style: { paddingBottom: 10 },
                    }}
                    dataSource={data}
                    renderItem={(item: BookMetaDataType) => (
                        <AntList.Item>
                            <Card
                                hoverable
                                cover={<Cover uuid={item.uuid} />}
                                actions={[
                                    <Menu mode="vertical" selectable={false}>
                                        <SubMenu key="sub4" icon={<SettingOutlined />} title="操作">
                                            <Menu.Item
                                                key="1"
                                                onClick={() => {
                                                    setDialogInfo({
                                                        title: '修改评分',
                                                        oldValue: item.stars,
                                                        allowEmptyStr: false,
                                                        handleOK: (newValue: any) => {
                                                            updateBookMeta(
                                                                item.uuid,
                                                                'stars',
                                                                newValue,
                                                            ).then(() => {
                                                                fetchBooks();
                                                            });
                                                        },
                                                        open: true,
                                                    });
                                                }}
                                            >
                                                修改评分
                                            </Menu.Item>
                                            <Menu.Item
                                                key="2"
                                                onClick={() => {
                                                    setDialogInfo({
                                                        title: '修改标签',
                                                        oldValue: item.subjects,
                                                        allowEmptyStr: false,
                                                        handleOK: (newValue: any) => {
                                                            updateBookMeta(
                                                                item.uuid,
                                                                'subjects',
                                                                newValue,
                                                            ).then(() => {
                                                                fetchBooks();
                                                            });
                                                        },
                                                        open: true,
                                                    });
                                                }}
                                            >
                                                修改标签
                                            </Menu.Item>
                                            <Menu.Item
                                                key="3"
                                                onClick={() => {
                                                    setDialogInfo({
                                                        title: '修改集合',
                                                        oldValue: item.collection_names,
                                                        allowEmptyStr: false,
                                                        handleOK: (newValue: any) => {
                                                            updateBookMeta(
                                                                item.uuid,
                                                                'collection_names',
                                                                newValue,
                                                            ).then(() => {
                                                                fetchBooks();
                                                            });
                                                        },
                                                        open: true,
                                                    });
                                                }}
                                            >
                                                修改集合
                                            </Menu.Item>
                                            <Menu.Item
                                                key="4"
                                                onClick={() => {
                                                    setDialogInfo({
                                                        title: '修改作者',
                                                        oldValue: item.author,
                                                        allowEmptyStr: false,
                                                        handleOK: (newValue: any) => {
                                                            updateBookMeta(
                                                                item.uuid,
                                                                'author',
                                                                newValue,
                                                            ).then(() => {
                                                                fetchBooks();
                                                            });
                                                        },
                                                        open: true,
                                                    });
                                                }}
                                            >
                                                修改作者
                                            </Menu.Item>
                                            <Menu.Item
                                                key="5"
                                                onClick={() => {
                                                    setDialogInfo({
                                                        title: '修改出版社',
                                                        oldValue: item.publisher,
                                                        allowEmptyStr: false,
                                                        handleOK: (newValue: any) => {
                                                            updateBookMeta(
                                                                item.uuid,
                                                                'publisher',
                                                                newValue,
                                                            ).then(() => {
                                                                fetchBooks();
                                                            });
                                                        },
                                                        open: true,
                                                    });
                                                }}
                                            >
                                                修改出版社
                                            </Menu.Item>
                                            <Menu.Item
                                                key="6"
                                                onClick={() => {
                                                    handleClickOpen(item.uuid);
                                                }}
                                            >
                                                <span style={{ color: 'red' }}>删除</span>
                                            </Menu.Item>
                                        </SubMenu>
                                    </Menu>,
                                ]}
                                bodyStyle={{
                                    paddingTop: 8,
                                    paddingLeft: 4,
                                    paddingRight: 4,
                                    paddingBottom: 8,
                                }}
                            >
                                <Card.Meta
                                    title={
                                        <div style={{ maxHeight: "30vh", overflow: 'auto' }}>
                                            <Typography
                                                variant="overline"
                                                display="block"
                                                style={{
                                                    wordBreak: 'break-all',
                                                    whiteSpace: 'break-spaces',
                                                    fontSize: 13,
                                                }}
                                                gutterBottom
                                            >
                                                {item.name}
                                            </Typography>
                                        </div>
                                    }
                                    description={
                                        <div style={{ maxHeight: "40vh", overflow: 'auto' }}>
                                            <RedTextTypography
                                                variant="overline"
                                                display="block"
                                                style={{
                                                    wordBreak: 'break-all',
                                                    whiteSpace: 'break-spaces',
                                                    fontSize: 12,
                                                    marginBottom: 0,
                                                }}
                                                gutterBottom
                                            >
                                                {`评分: ${item.stars}`}
                                            </RedTextTypography>
                                            <RedTextTypography
                                                variant="overline"
                                                display="block"
                                                style={{
                                                    wordBreak: 'break-all',
                                                    whiteSpace: 'break-spaces',
                                                    fontSize: 12,
                                                    marginBottom: 0,
                                                }}
                                                gutterBottom
                                            >
                                                {`集合: ${item.collection_names}`}
                                            </RedTextTypography>
                                            <RedTextTypography
                                                variant="overline"
                                                display="block"
                                                style={{
                                                    wordBreak: 'break-all',
                                                    whiteSpace: 'break-spaces',
                                                    fontSize: 12,
                                                    marginBottom: 0,
                                                }}
                                                gutterBottom
                                            >
                                                {`标签: ${item.subjects}`}
                                            </RedTextTypography>
                                            <RedTextTypography
                                                variant="overline"
                                                display="block"
                                                style={{
                                                    wordBreak: 'break-all',
                                                    whiteSpace: 'break-spaces',
                                                    fontSize: 12,
                                                    marginBottom: 0,
                                                }}
                                                gutterBottom
                                            >
                                                {`作者: ${item.author}`}
                                            </RedTextTypography>
                                            <RedTextTypography
                                                variant="overline"
                                                display="block"
                                                style={{
                                                    wordBreak: 'break-all',
                                                    whiteSpace: 'break-spaces',
                                                    fontSize: 12,
                                                    marginBottom: 0,
                                                }}
                                                gutterBottom
                                            >
                                                {`出版社: ${item.publisher}`}
                                            </RedTextTypography>
                                        </div>
                                    }
                                />
                            </Card>
                        </AntList.Item>
                    )}
                />
            </div>
            <ChangeInfo
                title={dialogInfo['title']}
                oldValue={dialogInfo['oldValue']}
                allowEmptyStr={dialogInfo['allowEmptyStr']}
                handleClose={handleCloseDialog}
                handleOK={dialogInfo['handleOK']}
                open={dialogInfo['open']}
            />

            <div>
                <Dialog
                    open={openDeleteBook}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">警告</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            确定删除这本书吗？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>取消</Button>
                        <Button
                            onClick={() => {
                                handleClose();
                                deleteBook(deleteBookUUID).then(() => {
                                    fetchBooks();
                                });
                            }}
                            autoFocus
                        >
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}
