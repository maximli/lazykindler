import { BookMetaDataType, CollectionDataType } from '@/pages/data';
import { getBooksMeta, getMultipleCollections, updateCollection } from '@/services';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import { Table } from 'antd';
import _ from 'lodash';
import prettyBytes from 'pretty-bytes';
import { useEffect, useState } from 'react';

const RedditTextField = styled((props: TextFieldProps) => (
    <TextField InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>} {...props} />
))(({ theme }) => ({
    '& .MuiFilledInput-root': {
        border: '1px solid #e2e2e1',
        overflow: 'hidden',
        borderRadius: 4,
        backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
        transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
        '&:hover': {
            backgroundColor: 'transparent',
        },
        '&.Mui-focused': {
            backgroundColor: 'transparent',
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
            borderColor: theme.palette.primary.main,
        },
    },
}));

type AddBooksProps = {
    open: boolean;
    handleClose: any;
    book_type: string;
    collection_uuid: string;
};

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        width: '40%',
    },
    {
        title: '作者',
        dataIndex: 'author',
        width: '40%',
    },
    {
        title: '大小',
        dataIndex: 'size',
        render: (size: any) => {
            return prettyBytes(size);
        },
        sorter: (a: BookMetaDataType, b: BookMetaDataType) => {
            return a.size - b.size;
        },
    },
];

export default function AddBooks(props: AddBooksProps) {
    const { open, handleClose, collection_uuid, book_type } = props;
    // allBooksMeta 用于保留所有数据
    const [allBooksMeta, setAllBooksMeta] = useState<BookMetaDataType[]>([]);
    // data 用于显示过滤后的数据
    const [data, setData] = useState<any>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

    const [collInfo, setCollInfo] = useState<any>({});

    const fetchAllBooks = () => {
        getBooksMeta(book_type).then((data) => {
            let d = _.map(data, (item: BookMetaDataType) => {
                return Object.assign({}, item, { key: item.uuid });
            });
            setAllBooksMeta(d);
        });
    };

    useEffect(() => {
        if (collection_uuid == null || book_type == null) {
            return;
        }
        getMultipleCollections([collection_uuid]).then((collectionInfo: CollectionDataType[]) => {
            setCollInfo(collectionInfo[0]);
            let item_uuids = collectionInfo[0].item_uuids;
            if (item_uuids != null) {
                setSelectedRowKeys(item_uuids.split(';'));
            }
        });
        getBooksMeta(book_type).then((data) => {
            let d = _.map(data, (item: BookMetaDataType) => {
                return Object.assign({}, item, { key: item.uuid });
            });
            setAllBooksMeta(d);
            setData(d);
        });
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: any) => {
            if (book_type === 'tmp') {
                if (keys.length == 0) {
                    setSelectedRowKeys(collInfo.item_uuids.split(';'));
                } else {
                    let l = keys;
                    if (collInfo.item_uuids != null) {
                        // 如果是从临时书籍中添加，那就默为往集合中增加书籍，而不是覆盖
                        l = _.uniq(collInfo.item_uuids.split(';').concat(keys));
                    }
                    setSelectedRowKeys(l);
                }
            } else {
                setSelectedRowKeys(keys);
            }
        },
    };

    const handleOnClose = () => {
        setSelectedRowKeys([]);
        handleClose();
    };

    const handleOnOk = () => {
        handleClose();
        updateCollection(collection_uuid, 'item_uuids', selectedRowKeys.join(';')).then(() => {
            fetchAllBooks();
        });
    };

    const onSearchChange = (e: any) => {
        const keyword = e.target.value;
        setData(
            _.filter(allBooksMeta, (item: BookMetaDataType) => {
                return (item.name != null && item.name.includes(keyword)) || (item.author != null && item.author.includes(keyword));
            }),
        );
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleOnClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="alert-dialog-title">
                    {book_type === 'tmp' ? '添加临时书籍' : '添加正式书籍'}
                </DialogTitle>
                <DialogContent style={{ margin: 'auto auto', width: '100%' }}>
                    <RedditTextField
                        label="搜索书名或作者"
                        // defaultValue="react-reddit"
                        id="reddit-input"
                        variant="filled"
                        style={{
                            width: '100%',
                            marginTop: 11,
                            marginBottom: 5,
                        }}
                        onChange={onSearchChange}
                    />
                    <div style={{ height: 620, width: '100%' }}>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={data}
                            scroll={{ y: 500 }}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOnClose}>取消</Button>
                    <Button onClick={handleOnOk} autoFocus>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
