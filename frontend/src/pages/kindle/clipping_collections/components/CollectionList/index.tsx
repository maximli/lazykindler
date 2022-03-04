import { CollectionDataType } from '@/pages/data';
import {
    deleteCollectionWithBooks,
    deleteCollectionWithoutBooks,
    updateCollection,
} from '@/services';
import { preHandleSubjects } from '@/util';
import { SettingOutlined, TagOutlined } from '@ant-design/icons';
import DateRangeIcon from '@mui/icons-material/DateRange';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { List as AntList, Card, Menu } from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ChangeInfo from '../../../../book_list/components/ChangeInfoDialog';
import Cover from '../../../../book_list/components/Cover';
import CollectionClippings from '../CollectionClippings';

const { SubMenu } = Menu;

type ClippingListProps = {
    data: any;
    fetchClippingCollections: any;
};

const initialDialogInfo = {
    title: '',
    allowEmptyStr: false,
    handleOK: null,
    open: false,
};

interface OpenDialogType {
    open: boolean;
    collection_uuid: any;
}

const intOpenDialogInfo: OpenDialogType = {
    open: false,
    collection_uuid: null,
};

export default function CollectionList(props: ClippingListProps) {
    const { data, fetchClippingCollections } = props;
    const [uuid1, setUUID1] = useState<any>(uuidv4());
    const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);
    const [openDeleteClipping, setOpenDeleteClipping] = useState(false);
    const [deleteClippingInfo, setDeleteClippingInfo] = useState<any>({});
    const [checkCollctionClippings, setCheckCollctionClippings] =
        useState<OpenDialogType>(intOpenDialogInfo);

    // deleteType
    // 0 初始值
    // 1 删除集合时不删除摘抄
    // 2 删除集合时删除摘抄
    const handleClickOpen = (uuid: string, deleteType: number) => {
        setDeleteClippingInfo({ uuid, deleteType });
        setOpenDeleteClipping(true);
    };

    const handleClose = () => {
        setOpenDeleteClipping(false);
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
                renderItem={(item: CollectionDataType) => (
                    <AntList.Item>
                        <Card
                            hoverable
                            cover={<Cover uuid={item.uuid} />}
                            actions={[
                                <Menu mode="vertical" selectable={false}>
                                    <SubMenu key="sub4" icon={<SettingOutlined />} title="操作">
                                        <Menu.Item
                                            key="-2"
                                            onClick={() => {
                                                setUUID1(uuidv4());
                                                setCheckCollctionClippings({
                                                    open: true,
                                                    collection_uuid: item.uuid,
                                                });
                                            }}
                                        >
                                            查看摘抄
                                        </Menu.Item>
                                        <Menu.Item
                                            key="1"
                                            onClick={() => {
                                                setDialogInfo({
                                                    title: '修改评分',
                                                    oldValue: item.stars,
                                                    allowEmptyStr: false,
                                                    handleOK: (newValue: any) => {
                                                        updateCollection(
                                                            item.uuid,
                                                            'stars',
                                                            newValue,
                                                        ).then(() => {
                                                            fetchClippingCollections();
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
                                                        updateCollection(
                                                            item.uuid,
                                                            'subjects',
                                                            preHandleSubjects(newValue),
                                                        ).then(() => {
                                                            fetchClippingCollections();
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
                                                handleClickOpen(item.uuid, 1);
                                            }}
                                        >
                                            <span style={{ color: 'red' }}>删除 (不删摘抄)</span>
                                        </Menu.Item>
                                        <Menu.Item
                                            key="7"
                                            onClick={() => {
                                                handleClickOpen(item.uuid, 2);
                                            }}
                                        >
                                            <span style={{ color: 'red' }}>删除 (删除摘抄)</span>
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
                                    <div
                                        style={{
                                            maxHeight: '30vh',
                                            overflow: 'auto',
                                            marginTop: 5,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
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
                                        <Divider style={{ marginBottom: 10 }} />
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            style={{ marginBottom: 10 }}
                                        >
                                            <StarIcon style={{ height: 20 }} />
                                            <Typography
                                                variant="body2"
                                                style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                            >
                                                {item.stars}
                                            </Typography>
                                        </Box>

                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            style={{ marginBottom: 10 }}
                                        >
                                            <TagOutlined style={{ height: 16, paddingLeft: 4.5 }} />
                                            <Typography
                                                variant="body2"
                                                style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                            >
                                                {item.subjects}
                                            </Typography>
                                        </Box>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            style={{ marginBottom: 10 }}
                                        >
                                            <DateRangeIcon style={{ height: 16 }} />
                                            <Typography
                                                variant="body2"
                                                style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                            >
                                                {item.create_time.split(' ')[0]}
                                            </Typography>
                                        </Box>
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
                    open={openDeleteClipping}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">警告</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {deleteClippingInfo.deleteType == 1
                                ? '删除集合将保留摘抄,确定删除该集合吗?'
                                : '删除集合将同时删除关联摘抄,确定删除该集合吗?'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>取消</Button>
                        <Button
                            onClick={() => {
                                handleClose();
                                if (deleteClippingInfo.deleteType == 1) {
                                    deleteCollectionWithoutBooks(deleteClippingInfo.uuid).then(
                                        () => {
                                            fetchClippingCollections();
                                        },
                                    );
                                } else {
                                    deleteCollectionWithBooks(deleteClippingInfo.uuid).then(() => {
                                        fetchClippingCollections();
                                    });
                                }
                            }}
                            autoFocus
                        >
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <CollectionClippings
                key={uuid1}
                open={checkCollctionClippings.open}
                handleClose={() => {
                    setCheckCollctionClippings(intOpenDialogInfo);
                }}
                collection_uuid={checkCollctionClippings.collection_uuid}
            />
        </div>
    );
}
