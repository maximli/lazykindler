import { getBooksMeta } from '@/services';
import {
    BankOutlined,
    DatabaseOutlined,
    DownOutlined,
    StarOutlined,
    TagsOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    FormControl,
    Grid,
    InputBase,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListSubheader,
    MenuItem,
    Select,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu as AntMenu, Dropdown } from 'antd';
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';

import type { BookMetaDataType } from '../../data';
import BookCardList from '../components/BookCardList';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

enum FilterType {
    All = '未分类',
    Stars = '评分',
    Subjects = '标签',
    Author = '作者',
    Publisher = '出版社',
}

type SubHeaerType = {
    Stars: Object;
    Subjects: Object;
    Author: Object;
    Publisher: Object;
};

type BooksProps = {
    storeType: string;
};

const Books: FC<BooksProps> = (props: BooksProps) => {
    const { storeType } = props;

    const [allBooksMeta, setAllBooksMeta] = useState([]);
    const [data, setData] = useState<any>([]);

    // 评分或者作者等等大类
    const [firstLevelType, setFirstLevelType] = useState<string>(FilterType.All);
    // 评分或者书签下面的列表
    const [secondLevelMenuList, setSecondLevelMenuList] = useState<string[]>([]);

    // 评分或者书签下选定的某一项
    const [selectedSecondLevel, setSelectedSecondLevel] = useState<any>(null);

    const [classifiedInfo, setClassifiedInfo] = useState<SubHeaerType>({
        Stars: {},
        Subjects: {},
        Author: {},
        Publisher: {},
    });

    const fetchBooks = () => {
        getBooksMeta(storeType).then((data) => {
            setAllBooksMeta(data);
            setData(data);

            const stars = {};
            const subjects = {};
            const authors = {};
            const publisher = {};
            _.forEach(data, (item: BookMetaDataType) => {
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

                if (authors[item.author] == null) {
                    authors[item.author] = {};
                }
                if (item.author != null) {
                    authors[item.author][item.uuid] = null;
                }

                if (publisher[item.publisher] == null) {
                    publisher[item.publisher] = {};
                }
                if (item.publisher != null) {
                    publisher[item.publisher][item.uuid] = null;
                }
            });

            let allInfo = {
                Stars: stars,
                Subjects: subjects,
                Author: authors,
                Publisher: publisher,
            };

            setClassifiedInfo(allInfo);

            switch (firstLevelType) {
                case FilterType.All:
                    setSecondLevelMenuList([]);
                    break;
                case FilterType.Stars:
                    setSecondLevelMenuList(Object.keys(allInfo.Stars));
                    break;
                case FilterType.Subjects:
                    setSecondLevelMenuList(Object.keys(allInfo.Subjects));
                    break;
                case FilterType.Author:
                    setSecondLevelMenuList(Object.keys(allInfo.Author));
                    break;
                case FilterType.Publisher:
                    setSecondLevelMenuList(Object.keys(allInfo.Publisher));
                    break;
            }

            filterData(allInfo, selectedSecondLevel);
        });
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filterData = (data: any, selectedKeyword: any) => {
        let allInfo;
        if (data != null) {
            allInfo = data;
        } else {
            allInfo = classifiedInfo;
        }
        setSelectedSecondLevel(selectedKeyword);

        let filteredBooks;
        let o = {};
        switch (firstLevelType) {
            case FilterType.Stars:
                o = allInfo.Stars[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredBooks = _.filter(allBooksMeta, (v: BookMetaDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
            case FilterType.Subjects:
                o = allInfo.Subjects[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredBooks = _.filter(allBooksMeta, (v: BookMetaDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
            case FilterType.Author:
                o = allInfo.Author[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredBooks = _.filter(allBooksMeta, (v: BookMetaDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
            case FilterType.Publisher:
                o = allInfo.Publisher[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredBooks = _.filter(allBooksMeta, (v: BookMetaDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
        }
    };

    const headerDropMenu = () => {
        return (
            <AntMenu style={{ width: '9vw' }}>
                <AntMenu.Item key="all" icon={<DatabaseOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setFirstLevelType(FilterType.All);
                            setSecondLevelMenuList([]);

                            setData(allBooksMeta);
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        未分类
                    </a>
                </AntMenu.Item>
                <AntMenu.Item key="stars" icon={<StarOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setFirstLevelType(FilterType.Stars);
                            setSecondLevelMenuList(Object.keys(classifiedInfo.Stars));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        评分
                    </a>
                </AntMenu.Item>
                <AntMenu.Item key="subjects" icon={<TagsOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setFirstLevelType(FilterType.Subjects);
                            setSecondLevelMenuList(Object.keys(classifiedInfo.Subjects));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        标签
                    </a>
                </AntMenu.Item>
                <AntMenu.Item key="author" icon={<UserOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setFirstLevelType(FilterType.Author);
                            setSecondLevelMenuList(Object.keys(classifiedInfo.Author));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        作者
                    </a>
                </AntMenu.Item>
                <AntMenu.Item key="publisher" icon={<BankOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setFirstLevelType(FilterType.Publisher);
                            setSecondLevelMenuList(Object.keys(classifiedInfo.Publisher));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        出版社
                    </a>
                </AntMenu.Item>
            </AntMenu>
        );
    };

    const MenuHeader = () => {
        switch (firstLevelType) {
            case FilterType.All:
                return (
                    <ListSubheader>
                        <Dropdown overlay={headerDropMenu}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <DatabaseOutlined style={{ paddingRight: 13 }} />
                                {firstLevelType}
                                <DownOutlined style={{ paddingLeft: 13 }} />
                            </a>
                        </Dropdown>
                    </ListSubheader>
                );
                break;
            case FilterType.Author:
                return (
                    <ListSubheader>
                        <Dropdown overlay={headerDropMenu}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <DatabaseOutlined style={{ paddingRight: 13 }} />
                                {firstLevelType}
                                <DownOutlined style={{ paddingLeft: 13 }} />
                            </a>
                        </Dropdown>
                    </ListSubheader>
                );
                break;

            case FilterType.Publisher:
                return (
                    <ListSubheader>
                        <Dropdown overlay={headerDropMenu}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <BankOutlined style={{ paddingRight: 13 }} />
                                {firstLevelType}
                                <DownOutlined style={{ paddingLeft: 13 }} />
                            </a>
                        </Dropdown>
                    </ListSubheader>
                );
                break;

            case FilterType.Stars:
                return (
                    <ListSubheader>
                        <Dropdown overlay={headerDropMenu}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <StarOutlined style={{ paddingRight: 13 }} />
                                {firstLevelType}
                                <DownOutlined style={{ paddingLeft: 13 }} />
                            </a>
                        </Dropdown>
                    </ListSubheader>
                );
                break;

            case FilterType.Subjects:
                return (
                    <ListSubheader>
                        <Dropdown overlay={headerDropMenu}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <TagsOutlined style={{ paddingRight: 13 }} />
                                {firstLevelType}
                                <DownOutlined style={{ paddingLeft: 13 }} />
                            </a>
                        </Dropdown>
                    </ListSubheader>
                );
                break;
            default:
                return null;
                break;
        }
    };

    return (
        <div>
            <div>
                <FormControl
                    sx={{ m: 1 }}
                    variant="standard"
                    style={{
                        width: '7.7vw',
                        marginBottom: 25,
                        marginLeft: -14,
                        marginTop: -14,
                        position: 'relative',
                    }}
                >
                    <Select
                        labelId="demo-customized-select-label"
                        id="demo-customized-select"
                        //   value={age}
                        //   onChange={handleChange}
                        input={<BootstrapInput />}
                    >
                        <MenuItem value={10}>全部</MenuItem>
                        <MenuItem value={20}>菜单栏</MenuItem>
                        <MenuItem value={30}>书籍</MenuItem>
                    </Select>
                </FormControl>
                <FormControl
                    sx={{ m: 1 }}
                    variant="standard"
                    style={{
                        width: '79.7vw',
                        marginBottom: 25,
                        marginLeft: -2,
                        marginTop: -14,
                        position: 'absolute',
                    }}
                >
                    <BootstrapInput id="demo-customized-textbox" />
                </FormControl>
            </div>

            <Grid container spacing={2}>
                <Grid item xs={2} style={{ paddingLeft: 3, paddingTop: 0 }}>
                    <List
                        sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                            position: 'relative',
                            height: '85vh',
                            overflow: 'auto',
                            '& ul': { padding: 0 },
                        }}
                        subheader={<li />}
                    >
                        {<MenuHeader />}

                        {secondLevelMenuList.map((item, index) => (
                            <ListItem
                                style={{ padding: 0 }}
                                key={index}
                                onClick={() => {
                                    filterData(null, item);
                                }}
                            >
                                <ListItemButton
                                    style={{ paddingLeft: 10, paddingRight: 10 }}
                                    selected={item === selectedSecondLevel}
                                >
                                    <ListItemText primary={`${index + 1}. ${item}`} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid
                    item
                    xs={10}
                    style={{
                        paddingTop: 0,
                        paddingLeft: 5,
                    }}
                >
                    <BookCardList data={data} fetchBooks={fetchBooks} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Books;
