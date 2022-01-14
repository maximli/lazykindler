import { BookMetaDataType } from '@/pages/data';
import { getBooksMeta } from '@/services';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import _ from 'lodash';

type AddBooksProps = {
    open: boolean;
    handleClose: any;
    collection_uuid: string;
    collection_book_uuids: string[];
};

export default function AddBooks(props: AddBooksProps) {
    const { open, handleClose, collection_uuid, collection_book_uuids } = props;
    const [allBooksMeta, setAllBooksMeta] = useState<BookMetaDataType[]>([]);

    const [checked, setChecked] = useState<any>({});

    useEffect(() => {
        let book_uuid_hash = {}
        _.forEach(collection_book_uuids, book_uuid => {
            book_uuid_hash[book_uuid] = {}
        })
        setChecked(book_uuid_hash)

        getBooksMeta('tmp').then((data) => {
            setAllBooksMeta(data);
        });
    }, []);

    const handleToggle = (book_uuid: string) => () => {
        const newChecked = Object.assign({...checked});
        if (newChecked.hasOwnProperty(book_uuid)) {
            delete newChecked[book_uuid]
        } else {
            newChecked[book_uuid] = {} 
        }

        setChecked(newChecked);
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
            >
                <DialogTitle id="alert-dialog-title">添加书籍</DialogTitle>
                <DialogContent style={{ margin: 'auto auto', width: 650 }}>
                    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {allBooksMeta.map((bookMeta: BookMetaDataType, index: number) => {
                            const labelId = `checkbox-list-secondary-label-${bookMeta.uuid}`;
                            return (
                                <ListItem
                                    key={bookMeta.uuid}
                                    style={{ width: 580 }}
                                    secondaryAction={
                                        <Checkbox
                                            edge="end"
                                            onChange={handleToggle(bookMeta.uuid)}
                                            checked={checked.hasOwnProperty(bookMeta.uuid)}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    }
                                    // disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemText
                                            id={labelId}
                                            primary={`${index + 1}: ${bookMeta.name}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleClose} autoFocus>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
