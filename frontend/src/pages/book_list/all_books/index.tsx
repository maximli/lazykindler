import { getAllBooksMeta } from '@/services';
import useWindowDimensions from '@/util';
import { Card, List as AntList, Typography, Menu, Dropdown } from 'antd';
import { FC, useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    ListItemButton,
    Grid,
    Paper,
    Box,
} from '@mui/material';

import {
    MoreOutlined,
    DownOutlined,
    StockOutlined,
    TagsOutlined,
    UserOutlined,
    BankOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import Cover from './components/Cover';
import type { ListItemDataType } from './data.d';

const { Text } = Typography;

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

const AllBooks: FC = () => {
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

    useEffect(() => {
        getAllBooksMeta().then((data) => {
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

    const cardList = (
        <AntList<ListItemDataType>
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
            renderItem={(item) => (
                <AntList.Item>
                    <Card
                        hoverable
                        cover={<Cover uuid={item.uuid} />}
                        actions={[<MoreOutlined />]}
                        bodyStyle={{
                            paddingTop: 8,
                            paddingLeft: 4,
                            paddingRight: 4,
                            paddingBottom: 8,
                        }}
                    >
                        <Card.Meta
                            title={
                                <div style={{ maxHeight: 80, overflow: 'auto' }}>
                                    <Text
                                        style={{
                                            wordBreak: 'break-all',
                                            whiteSpace: 'break-spaces',
                                            fontSize: 13,
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                </div>
                            }
                        />
                    </Card>
                </AntList.Item>
            )}
        />
    );

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

    const PaperWrapper = ({ children }: any) => {
        return <Paper style={{ height: height - 95 }}>{children}</Paper>;
    };

    return (
        <div style={{ height: height - 95 }}>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={2} style={{ paddingLeft: 3, paddingTop: 23, overflow: 'auto' }}>
                        <PaperWrapper>
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
                        </PaperWrapper>
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
                            <div style={{ width: width - 530 }}>{cardList}</div>
                        </PaperWrapper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default AllBooks;
