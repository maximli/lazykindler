import { getAllClippings, getMultipleCollections } from '@/services';
import {
    BookOutlined,
    DatabaseOutlined,
    DownOutlined,
    StarOutlined,
    TagsOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Grid, List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import { Menu as AntMenu, Dropdown } from 'antd';
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';

import type { ClippingCollectionDataType, ClippingDataType } from '../../data';
import ClippingCardList from '../components/ClippingCardList';

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

enum FilterType {
    All = '未分类',
    Stars = '评分',
    Subjects = '标签',
    Author = '作者',
    Book = '书籍',
}

type SubHeaerType = {
    Stars: Object;
    Subjects: Object;
    Author: Object;
    Book: Object;
};

const Clippings: FC = () => {
    const [allClippings, setAllClippings] = useState<ClippingDataType[]>([]);
    const [data, setData] = useState<ClippingDataType[]>([]);

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
        Book: {},
    });

    const fetchClippings = () => {
        getAllClippings().then((data: any) => {
            if (data == null) {
                data = [];
            }

            let coll_uuids: any = [];
            let clippingsCollsInfo = {};
            _.forEach(data, (item: ClippingDataType) => {
                if (item.coll_uuids == null) {
                    return;
                }
                coll_uuids = coll_uuids.concat(item.coll_uuids.split(';'));
            });
            coll_uuids = _.uniq(coll_uuids);

            getMultipleCollections(coll_uuids).then(
                (collInfoList: ClippingCollectionDataType[]) => {
                    _.forEach(collInfoList, (item: ClippingCollectionDataType) => {
                        clippingsCollsInfo[item.uuid] = item.name;
                    });

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].coll_uuids == null) {
                            continue;
                        }
                        let names: string[] = [];
                        _.forEach(data[i].coll_uuids.split(';'), (coll_uuid) => {
                            names.push(clippingsCollsInfo[coll_uuid]);
                        });
                        data[i].coll_names = names.join(';');
                    }

                    setData(data);
                    setAllClippings(data);
                },
            );

            const stars = {};
            const subjects = {};
            const authors = {};
            const books = {};

            _.forEach(data, (item: ClippingDataType) => {
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
                } else {
                    if (subjects['无标签'] == null) {
                        subjects['无标签'] = {};
                    }
                    subjects['无标签'][item.uuid] = null;
                }

                if (item.author == null) {
                    if (authors['无作者'] == null) {
                        authors['无作者'] = {};
                    }
                    authors['无作者'][item.uuid] = null;
                } else {
                    if (authors[item.author] == null) {
                        authors[item.author] = {};
                    }
                    authors[item.author][item.uuid] = null;
                }

                if (item.book_name == null) {
                    if (books['无书名'] == null) {
                        books['无书名'] = {};
                    }
                    books['无书名'][item.uuid] = null;
                } else {
                    if (books[item.book_name] == null) {
                        books[item.book_name] = {};
                    }
                    books[item.book_name][item.uuid] = null;
                }
            });

            let allInfo = {
                Stars: stars,
                Subjects: subjects,
                Author: authors,
                Book: books,
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
                case FilterType.Book:
                    setSecondLevelMenuList(Object.keys(allInfo.Book));
                    break;
            }

            filterData(allInfo, selectedSecondLevel, data);
        });
    };

    useEffect(() => {
        fetchClippings();
    }, []);

    const filterData = (data: any, selectedKeyword: any, allClippingsList: ClippingDataType[]) => {
        let allInfo;
        if (data != null) {
            allInfo = data;
        } else {
            allInfo = classifiedInfo;
        }
        setSelectedSecondLevel(selectedKeyword);

        let filteredClippings;
        let o = {};
        switch (firstLevelType) {
            case FilterType.All:
                filteredClippings = allClippingsList;
                break;
            case FilterType.Stars:
                o = allInfo.Stars[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredClippings = _.filter(allClippingsList, (v: ClippingDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredClippings);
                break;
            case FilterType.Subjects:
                o = allInfo.Subjects[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredClippings = _.filter(allClippingsList, (v: ClippingDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredClippings);
                break;
            case FilterType.Author:
                o = allInfo.Author[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredClippings = _.filter(allClippingsList, (v: ClippingDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredClippings);
                break;

            case FilterType.Book:
                o = allInfo.Book[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredClippings = _.filter(allClippingsList, (v: ClippingDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredClippings);
                break;
        }
        return filteredClippings;
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

                            setData(allClippings);
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
                <AntMenu.Item key="book" icon={<BookOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setFirstLevelType(FilterType.Book);
                            setSecondLevelMenuList(Object.keys(classifiedInfo.Book));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        书名
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

            case FilterType.Book:
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

    const onSearchChange = (e: any) => {
        const keyword = e.target.value;
        const list = filterData(null, selectedSecondLevel, allClippings);
        setData(
            _.filter(list, (item: ClippingDataType) => {
                if (
                    (item.book_name != null && item.book_name.includes(keyword)) ||
                    (item.author != null && item.author.includes(keyword)) ||
                    (item.subjects != null && item.subjects.includes(keyword)) ||
                    (item.content != null && item.content.includes(keyword))
                ) {
                    return true;
                }
                return false;
            }),
        );
    };

    return (
        <div>
            <div>
                <RedditTextField
                    label="搜索 书名、作者、摘抄、标签"
                    id="reddit-input"
                    variant="filled"
                    style={{
                        width: '100%',
                        marginBottom: 25,
                        marginTop: -15,
                        marginLeft: -13.5,
                    }}
                    onChange={onSearchChange}
                />
            </div>

            <Grid container spacing={2}>
                <Grid item xs={2} style={{ paddingLeft: 3, paddingTop: 0 }}>
                    <List
                        sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                            position: 'relative',
                            height: '83vh',
                            overflow: 'auto',
                            '& ul': { padding: 0 },
                        }}
                        subheader={<li />}
                    >
                        {<MenuHeader />}

                        {secondLevelMenuList.map((item, index) => (
                            <ListItem
                                style={{ padding: 0 }}
                                onClick={() => {
                                    filterData(null, item, allClippings);
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
                    <ClippingCardList data={data} fetchClippings={fetchClippings} height={83} columns={3} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Clippings;
