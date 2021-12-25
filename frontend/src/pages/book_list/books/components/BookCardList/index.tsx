import { Card, List as AntList, Typography } from 'antd';

import { MoreOutlined } from '@ant-design/icons';
import _ from 'lodash';
import Cover from '../Cover';
import type { ListItemDataType } from '../../data.d';

const { Text } = Typography;

type BookCardListProps = {
    data: any;
};

export default function BookCardList(props: BookCardListProps) {
    const { data } = props;

    return (
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
}
