import { getBooksMeta } from '@/services';
import { useWindowDimensions } from '@/util';
import { Menu, Dropdown } from 'antd';
import { FC, useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    ListItemButton,
    Grid,
    Box,
} from '@mui/material';

import {
    DownOutlined,
    StockOutlined,
    TagsOutlined,
    UserOutlined,
    BankOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import BookCardList from './components/BookCardList';
import type { ListItemDataType } from './data.d';
import PaperWrapper from './components/PaperWrapper';

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
    storeType: string
}

const Books: FC<BooksProps> = (props: BooksProps) => {
    const { storeType } = props;    

    const { width, height } = useWindowDimensions();
    const [allBooksMeta, setAllBooksMeta] = useState([]);
    const [data, setData] = useState<any>([]);

    // 评分或者作者等等大类
    const [selectedType, setSelectedType] = useState<string>(FilterType.All);
    // 评分或者书签下面的列表
    const [selectedSubType, setSelectedSubType] = useState<string[]>([]);

    // 评分或者书签下选定的某一项
    const [selectedItemName, setSelectedItemName] = useState<any>(null);

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
            _.forEach(data, (item: ListItemDataType) => {
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

            setClassifiedInfo({
                Stars: stars,
                Subjects: subjects,
                Author: authors,
                Publisher: publisher,
            });
        });
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    const filterData = (selectedKeyword: string) => {
        setSelectedItemName(selectedKeyword);

        let filteredBooks;
        let o = {};
        switch (selectedType) {
            case FilterType.Stars:
                o = classifiedInfo.Stars[selectedKeyword];
                filteredBooks = _.filter(allBooksMeta, (v: ListItemDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
            case FilterType.Subjects:
                o = classifiedInfo.Subjects[selectedKeyword];
                filteredBooks = _.filter(allBooksMeta, (v: ListItemDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
            case FilterType.Author:
                o = classifiedInfo.Author[selectedKeyword];
                filteredBooks = _.filter(allBooksMeta, (v: ListItemDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
            case FilterType.Publisher:
                o = classifiedInfo.Publisher[selectedKeyword];
                filteredBooks = _.filter(allBooksMeta, (v: ListItemDataType) => {
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
            <Menu style={{ width: 150 }}>
                <Menu.Item key="all" icon={<DatabaseOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setSelectedType(FilterType.All);
                            setSelectedSubType([]);

                            setData(allBooksMeta);
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
                <Menu.Item key="author" icon={<UserOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setSelectedType(FilterType.Author);
                            setSelectedSubType(Object.keys(classifiedInfo.Author));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        作者
                    </a>
                </Menu.Item>
                <Menu.Item key="publisher" icon={<BankOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setSelectedType(FilterType.Publisher);
                            setSelectedSubType(Object.keys(classifiedInfo.Publisher));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        出版社
                    </a>
                </Menu.Item>
            </Menu>
        );
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
                                <BookCardList data={data}/>
                            </div>
                        </PaperWrapper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Books;
