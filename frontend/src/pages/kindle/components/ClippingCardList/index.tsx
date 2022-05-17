import { ClippingDataType } from '@/pages/data';
import { deleteClipping, updateClipping } from '@/services';
import { SettingOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import { Card } from 'antd';
import { Menu } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ChangeInfo from '../../../book_list/components/ChangeInfoDialog';
import ChangeClippingColl from './ChangeClippingColl';
import styles from './index.less';

const { SubMenu } = Menu;

type ClippingCardListProps = {
    data: any;
    fetchClippings: any;
    height: Number;
    columns: number;
};

const initialDialogInfo = {
    title: '',
    allowEmptyStr: false,
    handleOK: null,
    open: false,
};

const ClippingCardList = (props: ClippingCardListProps) => {
    const { data, fetchClippings, height, columns } = props;

    const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);
    const [changeClippingCollInfo, setChangeClippingCollInfo] = useState<any>({
        item_uuid: '',
        open: false,
    });
    const [openDeleteClipping, setOpenDeleteClipping] = useState(false);
    const [deleteClippingUUID, setDeleteClippingUUID] = useState('');
    const [uuid, setUUID] = useState(uuidv4());
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleCloseDialog = () => {
        setDialogInfo(initialDialogInfo);
    };

    const handleClickOpen = (uuid: string) => {
        setDeleteClippingUUID(uuid);
        setOpenDeleteClipping(true);
    };

    const handleClose = () => {
        setOpenDeleteClipping(false);
    };

    return (
        <div>
            <GridContent>
                <Box sx={{ overflowY: 'scroll' }} style={{ height: `${height}vh` }}>
                    <ImageList variant="masonry" cols={columns} gap={15}>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((item: ClippingDataType) => (
                                <ImageListItem key={item.uuid}>
                                    <Card
                                        className={styles.card}
                                        hoverable
                                        actions={[
                                            <Menu mode="vertical" selectable={false}>
                                                <SubMenu
                                                    key="sub4"
                                                    icon={<SettingOutlined />}
                                                    title="操作"
                                                    style={{ zIndex: 10 }}
                                                >
                                                    <Menu.Item
                                                        key="1"
                                                        onClick={() => {
                                                            setDialogInfo({
                                                                title: '修改评分',
                                                                oldValue: item.stars,
                                                                allowEmptyStr: false,
                                                                handleOK: (newValue: any) => {
                                                                    updateClipping(
                                                                        item.uuid,
                                                                        'stars',
                                                                        newValue,
                                                                    ).then(() => {
                                                                        fetchClippings();
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
                                                                allowEmptyStr: true,
                                                                handleOK: (newValue: any) => {
                                                                    updateClipping(
                                                                        item.uuid,
                                                                        'subjects',
                                                                        newValue,
                                                                    ).then(() => {
                                                                        fetchClippings();
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
                                                            setUUID(uuidv4());
                                                            setChangeClippingCollInfo({
                                                                item_uuid: item.uuid,
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
                                                                allowEmptyStr: true,
                                                                handleOK: (newValue: any) => {
                                                                    updateClipping(
                                                                        item.uuid,
                                                                        'author',
                                                                        newValue,
                                                                    ).then(() => {
                                                                        fetchClippings();
                                                                    });
                                                                },
                                                                open: true,
                                                            });
                                                        }}
                                                    >
                                                        修改作者
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
                                    >
                                        <Card.Meta
                                            title={<a>{item.book_name}</a>}
                                            description={
                                                <div>
                                                    作者:{' '}
                                                    <span style={{ paddingLeft: 30 }}>
                                                        {item.author}
                                                    </span>
                                                    <br />
                                                    添加日期:{' '}
                                                    <span style={{ paddingLeft: 1 }}>
                                                        {moment
                                                            .unix(~~item.addDate)
                                                            .format('yyyy-MM-DD HH:mm:ss')}
                                                    </span>
                                                    <br />
                                                    标签:{' '}
                                                    <span style={{ paddingLeft: 30 }}>
                                                        {item.subjects}
                                                    </span>
                                                </div>
                                            }
                                        />
                                        <Typography
                                            variant="body1"
                                            gutterBottom
                                            className={styles.cardItemContent}
                                            style={{
                                                height: '100%',
                                                paddingTop: 10,
                                                fontSize: 15,
                                                whiteSpace: "pre-wrap"
                                            }}
                                        >
                                            {item.content}
                                        </Typography>
                                    </Card>
                                </ImageListItem>
                            ))}
                    </ImageList>
                    <TablePagination
                        rowsPerPageOptions={[15, 25, 50]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        labelRowsPerPage={<div style={{ paddingTop: 13.5 }}>每页数目</div>}
                        labelDisplayedRows={(paginationInfo: any) => (
                            <div style={{ paddingTop: 13.5 }}>
                                {paginationInfo.from}-{paginationInfo.to}---总共:
                                {paginationInfo.count}
                            </div>
                        )}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </GridContent>

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
                    open={openDeleteClipping}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">警告</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            确定删除摘抄吗？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>取消</Button>
                        <Button
                            onClick={() => {
                                handleClose();
                                deleteClipping(deleteClippingUUID).then(() => {
                                    fetchClippings();
                                });
                            }}
                            autoFocus
                        >
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <ChangeClippingColl
                key={uuid}
                item_uuid={changeClippingCollInfo['item_uuid']}
                open={changeClippingCollInfo['open']}
                fetchClippings={fetchClippings}
                handleClose={() => {
                    setChangeClippingCollInfo({
                        item_uuid: '',
                        open: false,
                    });
                }}
            />
        </div>
    );
};

export default ClippingCardList;
