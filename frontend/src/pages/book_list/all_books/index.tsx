import { getAllBooksMeta } from '@/services';
import useWindowDimensions from '@/util';
import { Card, Form, List, Typography, Layout, Menu, Dropdown } from 'antd';
import { FC, useEffect, useState } from 'react';
import { MoreOutlined, DownOutlined } from '@ant-design/icons';
import _ from 'lodash';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import Cover from './components/Cover';
import type { ListItemDataType } from './data.d';
import styles from './style.less';

const { Sider, Content } = Layout;

const FormItem = Form.Item;
const { Text } = Typography;

const listdata = [
    'Racing car sprays burning fuel i==========================================================',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
    'Los Angeles battles huge wildfires.',
];

enum FilterType {
    Stars = "stars",
    Subjects = "subjects",
    Author = "author",
    Size = "size",
    Publisher = "publisher",
  }

type SubHeaerType = {
    Stars: string[],
    Subjects: string[],
    Author: string[],
    Size: string[],
    Publisher: string[], 
}

const AllBooks: FC = () => {
    const { height } = useWindowDimensions();
    const [allBooksMeta, setAllBooksMeta] = useState([]);
    const [data, setData] = useState([]);

    const [ selectedType, setSelectedType ] = useState<string>("")
    const [ subHeaers, setSubHeaders] = useState<SubHeaerType>({
    Stars: [],
    Subjects: [],
    Author: [],
    Size: [],
    Publisher: [], 
    });

    useEffect(() => {
        getAllBooksMeta().then((data) => {
            setAllBooksMeta(data);
            setData(data)

            _.forEach(data, item => {
                
            })
        });
    }, []);


    const filterData = () => {
        switch selectedType {
            case FilterType.Stars:
                let d = _.filter()
                case FilterType.Subjects:
                    case FilterType.Author:
                        case FilterType.Size:
                            case FilterType.Publisher:
        }
    }

    const cardList = (
        <List<ListItemDataType>
            rowKey="id"
            // loading={loading}
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
                <List.Item>
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
                </List.Item>
            )}
        />
    );

    const headerDropMenu = () => {
        return (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={() => setSelectedType("stars")}>
                        评分
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={() => setSelectedType("subjects")} >
                        标签
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={() => setSelectedType("author")} >
                        作者
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={() => setSelectedType("size")} >
                        大小
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={() => setSelectedType("publisher")} >
                        出版社
                    </a>
                </Menu.Item>
            </Menu>
        );
    };

    return (
        <div>
            <div>
                <Card>
                    <Form
                        layout="inline"
                        onValuesChange={(_, values) => {
                            // 表单项变化时请求数据
                            // 模拟查询表单生效
                            // run(values);
                        }}
                    >
                        <StandardFormRow title="存储类型" block style={{ paddingBottom: 11 }}>
                            <FormItem name="category">
                                <TagSelect hideCheckAll expandable>
                                    <TagSelect.Option value="cat11">永久存储</TagSelect.Option>
                                    <TagSelect.Option value="cat12">临时导入</TagSelect.Option>
                                </TagSelect>
                            </FormItem>
                        </StandardFormRow>
                    </Form>
                </Card>
            </div>

            <Layout>
                <Sider width={200} style={{ marginTop: 20 }}>
                    <Card style={{ width: 260, height: height - 227, overflow: 'auto' }}>
                        <List
                            header={
                                <Dropdown overlay={headerDropMenu}>
                                    <a
                                        className="ant-dropdown-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        过滤书籍 <DownOutlined />
                                    </a>
                                </Dropdown>
                            }
                            footer={<div>Footer</div>}
                            // bordered
                            dataSource={listdata}
                            renderItem={(item) => (
                                <List.Item style={{ wordWrap: 'break-word' }}>
                                    <Typography.Text mark>[ITEM]</Typography.Text> {item}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Sider>
                <Content
                    style={{
                        padding: '0 24px',
                        minHeight: 280,
                        paddingLeft: 70,
                        height: height - 227,
                        overflow: 'auto',
                    }}
                >
                    <div className={styles.cardList}>
                        {cardList}
                    </div>
                </Content>
            </Layout>
        </div>
    );
};

export default AllBooks;
