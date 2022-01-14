import { getBooksMeta } from '@/services';
import { useWindowDimensions } from '@/util';
import { Menu as AntMenu, Dropdown } from 'antd';
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
import type { BookMetaDataType } from '../../data';

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

            switch (selectedType) {
                case FilterType.All:
                    setSelectedSubType([]);
                    break;
                case FilterType.Stars:
                    setSelectedSubType(Object.keys(allInfo.Stars));
                    break;
                case FilterType.Subjects:
                    setSelectedSubType(Object.keys(allInfo.Subjects));
                    break;
                case FilterType.Author:
                    setSelectedSubType(Object.keys(allInfo.Author));
                    break;
                case FilterType.Publisher:
                    setSelectedSubType(Object.keys(allInfo.Publisher));
                    break;
            }

            filterData(allInfo, selectedItemName);
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
        setSelectedItemName(selectedKeyword);

        let filteredBooks;
        let o = {};
        switch (selectedType) {
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
            <AntMenu style={{ width: 150 }}>
                <AntMenu.Item key="all" icon={<DatabaseOutlined />}>
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
                </AntMenu.Item>
                <AntMenu.Item key="stars" icon={<StockOutlined />}>
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
                </AntMenu.Item>
                <AntMenu.Item key="subjects" icon={<TagsOutlined />}>
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
                </AntMenu.Item>
                <AntMenu.Item key="author" icon={<UserOutlined />}>
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
                </AntMenu.Item>
                <AntMenu.Item key="publisher" icon={<BankOutlined />}>
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
                </AntMenu.Item>
            </AntMenu>
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
                                        filterData(null, item);
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
                        <div style={{ width: width - 530 }}>
                            <BookCardList data={data} fetchBooks={fetchBooks} />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Books;
