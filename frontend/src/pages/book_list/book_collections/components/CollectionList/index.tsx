import { CollectionDataType } from '@/pages/data';
import {
    deleteCollectionWithBooks,
    deleteCollectionWithoutBooks,
    updateCollection,
    updateCollectionCover,
} from '@/services';
import { countChOfStr, preHandleSubjects, toBase64 } from '@/util';
import { SettingOutlined } from '@ant-design/icons';
import ArchiveIcon from '@mui/icons-material/Archive';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import StarIcon from '@mui/icons-material/Star';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormHelperText,
    Typography,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import { List as AntList, Card, Menu } from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import ChangeInfo from '../../../components/ChangeInfoDialog';
import Cover from '../../../components/Cover';
import AddBooks from '../AddBooks';
import CollectionBooks from '../CollectionBooks';

const { SubMenu } = Menu;

type BookCardListProps = {
    data: any;
    fetchBookCollections: any;
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
    book_type?: any; // 书籍类型。 tmp  no_tmp
}

const intOpenDialogInfo: OpenDialogType = {
    open: false,
    collection_uuid: null,
    book_type: null,
};

export default function BookCardList(props: BookCardListProps) {
    const { data, fetchBookCollections } = props;
    const [uuid1, setUUID1] = useState<any>(uuidv4());
    const [uuid2, setUUID2] = useState<any>(uuidv4());
    const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);
    const [openDeleteBook, setOpenDeleteBook] = useState(false);
    const [deleteBookInfo, setDeleteBookInfo] = useState<any>({});
    const [addBooksInfo, setAddBooksInfo] = useState<OpenDialogType>(intOpenDialogInfo);
    const [checkCollctionBooks, setCheckCollctionBooks] =
        useState<OpenDialogType>(intOpenDialogInfo);

    const [formData, setFormData] = useState<any>({});

    const [uuidForEditCover, setUUIDForEditCover] = useState<any>();
    const [openForEditCover, setOpenForEditCover] = useState(false);

    const handleOpenForEditCover = () => {
        setOpenForEditCover(true);
    };

    const handleCloseForEditCover = () => {
        setOpenForEditCover(false);
    };

    // deleteType
    // 0 初始值
    // 1 删除集合时不删除书籍
    // 2 删除集合时删除书籍
    const handleClickOpen = (uuid: string, deleteType: number) => {
        setDeleteBookInfo({ uuid, deleteType });
        setOpenDeleteBook(true);
    };

    const handleClose = () => {
        setOpenDeleteBook(false);
        setDialogInfo(initialDialogInfo);
    };

    const handleCloseDialog = () => {
        setDialogInfo(initialDialogInfo);
    };

    const handleEditCollCover = () => {
        let cover = formData['cover'];

        if (cover == null || cover.trim() == '') {
            return false;
        }

        cover = cover.trim();

        updateCollectionCover(uuidForEditCover, cover).then(() => {
            fetchBookCollections();
        });
        return true;
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
                                            key="1"
                                            onClick={() => {
                                                setUUID1(uuidv4());
                                                setCheckCollctionBooks({
                                                    open: true,
                                                    collection_uuid: item.uuid,
                                                });
                                            }}
                                        >
                                            查看书籍
                                        </Menu.Item>
                                        <Menu.Item
                                            key="2"
                                            onClick={() => {
                                                setUUID2(uuidv4());
                                                setAddBooksInfo({
                                                    open: true,
                                                    collection_uuid: item.uuid,
                                                    book_type: 'no_tmp',
                                                });
                                            }}
                                        >
                                            添加正式书籍
                                        </Menu.Item>
                                        <Menu.Item
                                            key="3"
                                            onClick={() => {
                                                setUUID2(uuidv4());
                                                setAddBooksInfo({
                                                    open: true,
                                                    collection_uuid: item.uuid,
                                                    book_type: 'tmp',
                                                });
                                            }}
                                        >
                                            添加临时书籍
                                        </Menu.Item>
                                        <Menu.Item
                                            key="4"
                                            onClick={() => {
                                                setDialogInfo({
                                                    title: '修改名称',
                                                    oldValue: item.name,
                                                    allowEmptyStr: false,
                                                    handleOK: (newValue: any) => {
                                                        updateCollection(
                                                            item.uuid,
                                                            'name',
                                                            newValue,
                                                        ).then(() => {
                                                            fetchBookCollections();
                                                        });
                                                    },
                                                    open: true,
                                                });
                                            }}
                                        >
                                            修改名称
                                        </Menu.Item>
                                        <Menu.Item
                                            key="5"
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
                                            key="6"
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
                                            key="7"
                                            onClick={() => {
                                                handleOpenForEditCover();
                                                setUUIDForEditCover(item.uuid);
                                            }}
                                        >
                                            修改封面
                                        </Menu.Item>
                                        <Menu.Item
                                            key="8"
                                            onClick={() => {
                                                handleClickOpen(item.uuid, 1);
                                            }}
                                        >
                                            <span style={{ color: 'red' }}>删除 (不删书籍)</span>
                                        </Menu.Item>
                                        <Menu.Item
                                            key="9"
                                            onClick={() => {
                                                handleClickOpen(item.uuid, 2);
                                            }}
                                        >
                                            <span style={{ color: 'red' }}>删除 (删除书籍)</span>
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
                                            <FormatListNumberedIcon style={{ height: 20 }} />
                                            <Typography
                                                variant="body2"
                                                style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                            >
                                                {countChOfStr(item.item_uuids, ";") + 1} 本书
                                            </Typography>
                                        </Box>

                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            style={{ marginBottom: 10 }}
                                        >
                                            <ArchiveIcon style={{ height: 16 }} />
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
                    open={openDeleteBook}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">警告</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {deleteBookInfo.deleteType == 1
                                ? '删除集合将保留书籍,确定删除该集合吗?'
                                : '删除集合将同时删除关联书籍,确定删除该集合吗?'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>取消</Button>
                        <Button
                            onClick={() => {
                                handleClose();
                                if (deleteBookInfo.deleteType == 1) {
                                    deleteCollectionWithoutBooks(deleteBookInfo.uuid).then(() => {
                                        fetchBookCollections();
                                    });
                                } else {
                                    deleteCollectionWithBooks(deleteBookInfo.uuid).then(() => {
                                        fetchBookCollections();
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

            <Dialog
                open={openForEditCover}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="alert-dialog-title">{'修改集合封面'}</DialogTitle>
                <DialogContent style={{ margin: '0 auto' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            '& .MuiTextField-root': { width: '25ch' },
                        }}
                    >
                        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                            <Typography
                                style={{ position: 'relative', paddingTop: 5 }}
                                variant="subtitle1"
                                gutterBottom
                                component="div"
                            >
                                封面:
                            </Typography>
                            <div style={{ position: 'absolute', paddingLeft: 45 }}>
                                <Dropzone
                                    onDrop={async (acceptedFiles) => {
                                        let base64Str = await toBase64(acceptedFiles[0]);
                                        setFormData({ ...formData, cover: base64Str });
                                    }}
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                {formData.cover == null ? (
                                                    <Button variant="contained">上传</Button>
                                                ) : (
                                                    <Chip
                                                        label="封面"
                                                        onDelete={() => {
                                                            setFormData({
                                                                ...formData,
                                                                cover: null,
                                                            });
                                                        }}
                                                        deleteIcon={<DeleteIcon />}
                                                        variant="outlined"
                                                    />
                                                )}
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                                <FormHelperText id="standard-weight-helper-text">
                                    不能为空
                                </FormHelperText>
                            </div>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForEditCover}>取消</Button>
                    <Button
                        onClick={() => {
                            let ok = handleEditCollCover();
                            if (ok) {
                                handleCloseForEditCover();
                            }
                        }}
                        autoFocus
                    >
                        确认
                    </Button>
                </DialogActions>
            </Dialog>

            <AddBooks
                key={uuid2}
                open={addBooksInfo.open}
                handleClose={() => {
                    setAddBooksInfo(intOpenDialogInfo);
                }}
                collection_uuid={addBooksInfo.collection_uuid}
                book_type={addBooksInfo.book_type}
            />

            <CollectionBooks
                key={uuid1}
                open={checkCollctionBooks.open}
                handleClose={() => {
                    setCheckCollctionBooks(intOpenDialogInfo);
                }}
                collection_uuid={checkCollctionBooks.collection_uuid}
            />
        </div>
    );
}
