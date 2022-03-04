import { ClippingDataType, CollectionDataType } from '@/pages/data';
import { getClippingByUUIDs, getMultipleCollections } from '@/services';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import ClippingCardList from '../../../components/ClippingCardList';

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

type CollectionClippingsProps = {
    open: boolean;
    handleClose: any;
    collection_uuid: string;
};

export default function CollectionClippings(props: CollectionClippingsProps) {
    const { open, handleClose, collection_uuid } = props;

    // allClippings 用于保留所有数据
    const [allClippings, setAllClipping] = useState<ClippingDataType[]>([]);
    // data 用于显示过滤后的数据
    const [data, setData] = useState<ClippingDataType[]>([]);
    const [collectionInfo, setCollectionInfo] = useState<any>({});

    const fetchClipping = () => {
        if (collection_uuid == null) {
            return;
        }
        getMultipleCollections([collection_uuid]).then((collectionInfo: CollectionDataType[]) => {
            let coll_info = collectionInfo[0];
            setCollectionInfo(coll_info);

            let item_uuids = coll_info.item_uuids;
            if (item_uuids == null) {
                return;
            }
            getClippingByUUIDs(item_uuids).then((data) => {
                let clippingCollsInfo = {};
                let coll_uuids: any = [];

                let clippings_info: any = _.map(data, (item: ClippingDataType) => {
                    if (item.coll_uuids != null) {
                        coll_uuids = coll_uuids.concat(item.coll_uuids.split(';'));
                    }
                    return Object.assign({}, item, { key: item.uuid });
                });

                coll_uuids = _.uniq(coll_uuids);

                getMultipleCollections(coll_uuids).then(
                    (clippingCollInfoList: CollectionDataType[]) => {
                        _.forEach(clippingCollInfoList, (item: CollectionDataType) => {
                            clippingCollsInfo[item.uuid] = item.name;
                        });

                        for (let i = 0; i < clippings_info.length; i++) {
                            let names: string[] = [];
                            if (clippings_info[i].coll_uuids != null) {
                                _.forEach(clippings_info[i].coll_uuids.split(';'), (coll_uuid) => {
                                    names.push(clippingCollsInfo[coll_uuid]);
                                });
                            }
                            clippings_info[i].coll_names = names.join(';');
                        }

                        setData(clippings_info);
                        setAllClipping(clippings_info);
                    },
                );
            });
        });
    };

    useEffect(() => {
        fetchClipping();
    }, []);

    const onSearchChange = (e: any) => {
        const keyword = e.target.value;
        setData(
            _.filter(allClippings, (item: ClippingDataType) => {
                return item.book_name.includes(keyword) || item.author.includes(keyword)  || item.content.includes(keyword);
            }),
        );
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
                style={{ zIndex: 800 }}
            >
                <DialogTitle id="alert-dialog-title">{collectionInfo.name}</DialogTitle>
                <DialogContent>
                    <RedditTextField
                        label="搜索书名、作者、摘抄"
                        id="reddit-input"
                        variant="filled"
                        style={{
                            width: '100%',
                            marginTop: 11,
                            marginBottom: 20,
                        }}
                        onChange={onSearchChange}
                    />
                    <ClippingCardList data={data} fetchClippings={fetchClipping} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>关闭</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
