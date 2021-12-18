import useWindowDimensions from '@/util';
// import { Card, Col, Form, List, Row, Select, Typography, Divider } from 'antd';
import { Card, Col, Form, List, Row, Select, Typography, Divider, Layout } from 'antd';
import moment from 'moment';
import type { FC } from 'react';
import { useRequest } from 'umi';
import AvatarList from './components/AvatarList';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import type { ListItemDataType } from './data.d';
import { queryFakeList } from './service';
import styles from './style.less';

const { Header, Footer, Sider, Content } = Layout;

const FormItem = Form.Item;
const { Paragraph } = Typography;

const getKey = (id: string, index: number) => `${id}-${index}`;

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

const Projects: FC = () => {
    const { data, loading, run } = useRequest((values: any) => {
        console.log('form data', values);
        return queryFakeList({
            count: 8,
        });
    });
    const { width, height } = useWindowDimensions();

    const list = data?.list || [];

    const cardList = list && (
        <List<ListItemDataType>
            rowKey="id"
            loading={loading}
            grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 4,
                xxl: 4,
            }}
            dataSource={list}
            renderItem={(item) => (
                <List.Item>
                    <Card
                        className={styles.card}
                        hoverable
                        cover={<img alt={item.title} src={item.cover} />}
                    >
                        <Card.Meta
                            title={<a>{item.title}</a>}
                            description={
                                <Paragraph className={styles.item} ellipsis={{ rows: 2 }}>
                                    {item.subDescription}
                                </Paragraph>
                            }
                        />
                        <div className={styles.cardItemContent}>
                            <span>{moment(item.updatedAt).fromNow()}</span>
                            <div className={styles.avatarList}>
                                <AvatarList size="small">
                                    {item.members.map((member, i) => (
                                        <AvatarList.Item
                                            key={getKey(item.id, i)}
                                            src={member.avatar}
                                            tips={member.name}
                                        />
                                    ))}
                                </AvatarList>
                            </div>
                        </div>
                    </Card>
                </List.Item>
            )}
        />
    );

    return (
        <div>
            <div>
                {/* <Card bordered={false}> */}
                <Card>
                    <Form
                        layout="inline"
                        onValuesChange={(_, values) => {
                            // 表单项变化时请求数据
                            // 模拟查询表单生效
                            run(values);
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
                            header={<div>Header</div>}
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
                <Content style={{ padding: '0 24px', minHeight: 280, paddingLeft: 70 }}>
                    <div style={{ paddingTop: 20 }} className={styles.cardList}>
                        {cardList}
                    </div>
                </Content>
            </Layout>
        </div>
    );
};

export default Projects;
