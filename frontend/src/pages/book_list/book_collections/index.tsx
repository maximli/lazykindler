import {
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Grid,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from '@mui/material';
import Dropzone from 'react-dropzone';

import ListItemIcon from '@mui/material/ListItemIcon';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash';
import BookCardList from '../books/components/BookCardList';
import PaperWrapper from '../books/components/PaperWrapper';
import { useEffect, useState } from 'react';
import { createBookCollection, getBookCollections } from '@/services';
import { useWindowDimensions, toBase64 } from '@/util';
import { BookCollectionDataType } from './data';

export default function BookCollections() {
    const [data, setData] = useState<any>([]);
    const { width, height } = useWindowDimensions();
    const [selectedItemName, setSelectedItemName] = useState<any>(null);

    const [formData, setFormData] = useState<any>({});

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchData = () => {
        getBookCollections().then((data) => {
            setData(data);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = () => {
        let name = formData['name'];
        let description = formData['description'];
        let subjects = formData['subjects'];
        let stars = formData['stars'];
        let cover = formData['cover'];

        if (name == null || name.trim() == '') {
            return false;
        }
        if (description == null || description.trim() == '') {
            description = '';
        }
        if (subjects == null || subjects.trim() == '') {
            return false;
        }
        if (stars == null || stars.trim() == '') {
            return false;
        }
        if (cover == null || cover.trim() == '') {
            return false;
        }

        name = name.trim();
        description = description.trim();
        let subjectsList = subjects.trim().split(';');
        if (isNaN(stars.trim())) {
            return false;
        }
        stars = Number(stars.trim());
        cover = cover.trim();

        createBookCollection(name, description, subjectsList.join(';'), stars, cover);
        return true;
    };

    return (
        <div style={{ height: height - 95 }}>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={2} style={{ paddingLeft: 3, paddingTop: 23, overflow: 'auto' }}>
                        <List
                            sx={{
                                width: '100%',
                                bgcolor: 'background.paper',
                                position: 'relative',
                                overflow: 'auto',
                                height: height - 95,
                                '& ul': { padding: 0 },
                            }}
                            subheader={<li />}
                        >
                            {data.map((book_collection: BookCollectionDataType, index: number) => (
                                <ListItem
                                    style={{ padding: 0 }}
                                    key={index}
                                    onClick={() => {
                                        setSelectedItemName(book_collection.name);
                                    }}
                                >
                                    <ListItemButton
                                        style={{ paddingLeft: 10, paddingRight: 10 }}
                                        selected={book_collection.name === selectedItemName}
                                    >
                                        <ListItemText
                                            primary={`${index + 1}. ${book_collection.name}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                            <ListItemButton onClick={handleClickOpen}>
                                <ListItemIcon style={{ paddingLeft: 70 }}>
                                    <AddIcon />
                                </ListItemIcon>
                            </ListItemButton>
                        </List>
                    </Grid>
                    <Grid
                        item
                        xs={10}
                        style={{
                            paddingTop: 0,
                            paddingLeft: 5,
                            height: height - 70,
                            overflow: 'auto',
                        }}
                    >
                        <PaperWrapper>
                            <div style={{ width: width - 530 }}>
                                <BookCardList data={data} />
                            </div>
                        </PaperWrapper>
                    </Grid>
                </Grid>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="alert-dialog-title">{'创建书籍集合'}</DialogTitle>
                <DialogContent style={{ margin: '0 auto' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            '& .MuiTextField-root': { width: '25ch' },
                        }}
                    >
                        <TextField
                            label={'name'}
                            id="name"
                            helperText="不能为空"
                            margin="dense"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData({ ...formData, name: event.target.value });
                            }}
                        />
                        <TextField
                            label={'description'}
                            id="description"
                            margin="dense"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData({ ...formData, description: event.target.value });
                            }}
                        />
                        <TextField
                            label={'subjects'}
                            id="subjects"
                            helperText="标签，多个标签分号相隔"
                            margin="dense"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData({ ...formData, subjects: event.target.value });
                            }}
                        />
                        <TextField
                            label={'stars'}
                            id="stars"
                            helperText="整数，建议最高9分"
                            margin="dense"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData({ ...formData, stars: event.target.value });
                            }}
                        />
                        <Dropzone
                            onDrop={async (acceptedFiles) => {
                                console.log(acceptedFiles);
                                let base64Str = await toBase64(acceptedFiles[0])
                                setFormData({ ...formData, cover: base64Str });
                            }}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p>集合封面，脱宅上传</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button
                        onClick={() => {
                            let ok = handleCreate();
                            if (ok) {
                                handleClose();
                            }
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
