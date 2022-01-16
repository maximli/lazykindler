import { Card, List as AntList } from 'antd';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Cover from '../../../components/Cover';
import ChangeInfo from '../../../components/ChangeInfoDialog';

import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { deleteBookCollection, updateBookCollection } from '@/services';
import { preHandleSubjects, useWindowDimensions } from '@/util';
import AddBooks from '../AddBooks';

const { SubMenu } = Menu;

type BookCardListProps = {
    data: any;
    fetchBookCollections: any;
};

const RedTextTypography = withStyles({
    root: {
        color: '#f44336',
    },
})(Typography);

const initialDialogInfo = {
    title: '',
    allowEmptyStr: false,
    handleOK: null,
    open: false,
};

export default function BookCardList(props: BookCardListProps) {
    const { data, fetchBookCollections } = props;
    const { width, height } = useWindowDimensions();

    const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);

    const [openDeleteBook, setOpenDeleteBook] = useState(false);
    const [deleteBookInfo, setDeleteBookInfo] = useState<any>({});

    const [openForAddBooks, setOpenForAddBooks] = useState<boolean>(false);

    const [collectionInfo, setCollectionInfo] = useState<any>({});

    const handleClickOpen = (uuid: string, name: string) => {
        setDeleteBookInfo({ uuid, name });
        setOpenDeleteBook(true);
    };

    const handleClose = () => {
        setOpenDeleteBook(false);
    };

    const handleCloseDialog = () => {
        setDialogInfo(initialDialogInfo);
    };

    return (
        <div>
            <AntList<any>
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
                    position: 'top',
                    defaultPageSize: 40,
                    hideOnSinglePage: true,
                    style: { paddingBottom: 10 },
                }}
                dataSource={data}
                renderItem={(item) => (
                    <AntList.Item>
                        <Card
                            hoverable
                            cover={<Cover uuid={item.uuid} />}
                            actions={[
                                <Menu mode="vertical" selectable={false}>
                                    <SubMenu key="sub4" icon={<SettingOutlined />} title="操作">
                                        <Menu.Item
                                            key="0"
                                            onClick={() => {
                                                setOpenForAddBooks(true);

                                                let book_uuids = []
                                                if (item.book_uuids != null) {
                                                    book_uuids = item.book_uuids.split(';') || []
                                                }
                                                setCollectionInfo({
                                                    uuid: item.uuid,
                                                    book_uuids,
                                                })
                                            }}
                                        >
                                            添加书籍
                                        </Menu.Item>
                                        <Menu.Item
                                            key="1"
                                            onClick={() => {
                                                setDialogInfo({
                                                    title: '修改评分',
                                                    oldValue: item.stars,
                                                    allowEmptyStr: false,
                                                    handleOK: (newValue: any) => {
                                                        updateBookCollection(
                                                            item.uuid,
                                                            'stars',
                                                            newValue,
                                                        ).then(() => {
                                                            fetchBookCollections();
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
                                                        updateBookCollection(
                                                            item.uuid,
                                                            'subjects',
                                                            preHandleSubjects(newValue),
                                                        ).then(() => {
                                                            fetchBookCollections();
                                                        });
                                                    },
                                                    open: true,
                                                });
                                            }}
                                        >
                                            修改标签
                                        </Menu.Item>
                                        <Menu.Item
                                            key="6"
                                            onClick={() => {
                                                handleClickOpen(item.uuid, item.name);
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
                                    <div style={{ maxHeight: 80, overflow: 'auto' }}>
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
                                    <div style={{ maxHeight: 150, overflow: 'auto' }}>
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
                                            {`时间: ${item.create_time.split(' ')[0]}`}
                                        </RedTextTypography>
                                    </div>
                                }
                            />
                        </Card>
                    </AntList.Item>
                )}
            />

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
                            确定删除这个集合吗？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>取消</Button>
                        <Button
                            onClick={() => {
                                handleClose();
                                deleteBookCollection(deleteBookInfo.uuid, deleteBookInfo.name).then(
                                    () => {
                                        fetchBookCollections();
                                    },
                                );
                            }}
                            autoFocus
                        >
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <AddBooks
                open={openForAddBooks}
                handleClose={() => {
                    setOpenForAddBooks(false);
                }}
                collection_uuid={collectionInfo['uuid']}
                collection_book_uuids={collectionInfo['book_uuids']}
            />
        </div>
    );
}
