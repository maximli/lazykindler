import {
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    ListSubheader,
    Grid,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from '@mui/material';
import { Menu, Dropdown } from 'antd';
import { DownOutlined, StockOutlined, TagsOutlined, DatabaseOutlined } from '@ant-design/icons';
import Dropzone from 'react-dropzone';

import ListItemIcon from '@mui/material/ListItemIcon';
import AddIcon from '@mui/icons-material/Add';
import _ from 'lodash';
import BookCardList from './components/BookCardList';
import { useEffect, useState } from 'react';
import { createBookCollection, getBookCollections } from '@/services';
import { useWindowDimensions, toBase64 } from '@/util';
import { BookCollectionDataType } from './data';

enum FilterType {
    All = '未分类',
    Stars = '评分',
    Subjects = '标签',
}

type SubHeaerType = {
    Stars: Object;
    Subjects: Object;
};

export default function BookCollections() {
    const [data, setData] = useState<any>([]);
    const { width, height } = useWindowDimensions();
    // 选择的大的分类
    const [selectedType, setSelectedType] = useState<string>(FilterType.All);
    // 选择的大的分类下面的列表
    const [selectedSubType, setSelectedSubType] = useState<string[]>([]);
    // 选择的大的分类下面的列表的小条目
    const [selectedItemName, setSelectedItemName] = useState<any>(null);

    const [allBookCollections, setAllBookCollections] = useState<BookCollectionDataType[]>([]);

    const [classifiedInfo, setClassifiedInfo] = useState<SubHeaerType>({
        Stars: {},
        Subjects: {},
    });

    const [formData, setFormData] = useState<any>({});

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchData = () => {
        getBookCollections().then((data: BookCollectionDataType[]) => {
            setAllBookCollections(data);
            setData(data);

            const stars = {};
            const subjects = {};
            _.forEach(data, (item: BookCollectionDataType) => {
                if (stars[item.stars] == null) {
                    stars[item.stars] = {};
                }
                if (item.stars != null) {
                    stars[item.stars][item.uuid] = null;
                }

                if (item.subjects != null) {
                    let subjectsList = item.subjects.split(';');
                    subjectsList.forEach((subject) => {
                        if (subjects[subject] == null) {
                            subjects[subject] = {};
                        }
                        subjects[subject][item.uuid] = null;
                    });
                }
            });

            setClassifiedInfo({
                Stars: stars,
                Subjects: subjects,
            });
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

    const headerDropMenu = () => {
        return (
            <Menu style={{ width: 150 }}>
                <Menu.Item key="all" icon={<DatabaseOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setSelectedType(FilterType.All);
                            setSelectedSubType([]);

                            setData(allBookCollections);
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        未分类
                    </a>
                </Menu.Item>
                <Menu.Item key="stars" icon={<StockOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setSelectedType(FilterType.Stars);
                            setSelectedSubType(Object.keys(classifiedInfo.Stars));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        评分
                    </a>
                </Menu.Item>
                <Menu.Item key="subjects" icon={<TagsOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setSelectedType(FilterType.Subjects);
                            setSelectedSubType(Object.keys(classifiedInfo.Subjects));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        标签
                    </a>
                </Menu.Item>
            </Menu>
        );
    };

    const filterData = (selectedKeyword: string) => {
        setSelectedItemName(selectedKeyword);

        let filteredBooks;
        let o = {};
        switch (selectedType) {
            case FilterType.Stars:
                o = classifiedInfo.Stars[selectedKeyword];
                filteredBooks = _.filter(allBookCollections, (v: BookCollectionDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
            case FilterType.Subjects:
                o = classifiedInfo.Subjects[selectedKeyword];
                filteredBooks = _.filter(allBookCollections, (v: BookCollectionDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
        }
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
                            <ListSubheader>
                                <Dropdown overlay={headerDropMenu}>
                                    <a
                                        className="ant-dropdown-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <DatabaseOutlined style={{ paddingRight: 13 }} />
                                        {selectedType}
                                        <DownOutlined style={{ paddingLeft: 13 }} />
                                    </a>
                                </Dropdown>
                            </ListSubheader>
                            {selectedSubType.map((item, index) => (
                                <ListItem
                                    style={{ padding: 0 }}
                                    key={index}
                                    onClick={() => {
                                        filterData(item);
                                    }}
                                >
                                    <ListItemButton
                                        style={{ paddingLeft: 10, paddingRight: 10 }}
                                        selected={item === selectedItemName}
                                    >
                                        <ListItemText primary={`${index + 1}. ${item}`} />
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
                        <div style={{ width: width - 530 }}>
                            <BookCardList data={data} />
                        </div>
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
                                let base64Str = await toBase64(acceptedFiles[0]);
                                setFormData({ ...formData, cover: base64Str });
                            }}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p>集合封面，拖拽上传</p>
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
