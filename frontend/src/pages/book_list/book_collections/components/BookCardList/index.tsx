import { Card, List as AntList } from 'antd';
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Cover from '../../../books/components/Cover';

import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

type BookCardListProps = {
    data: any;
};

const RedTextTypography = withStyles({
    root: {
        color: '#f44336',
    },
})(Typography);

export default function BookCardList(props: BookCardListProps) {
    const { data } = props;

    function handleClick(e: any) {
        console.log('click', e);
    }

    return (
        <AntList<any>
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
                        actions={[
                            <Menu onClick={handleClick} mode="vertical" selectable={false}>
                                <SubMenu
                                    key="sub4"
                                    icon={<SettingOutlined />}
                                    title="操作"
                                >
                                    <Menu.Item key="1">修改评分</Menu.Item>
                                    <Menu.Item key="2">修改标签</Menu.Item>
                                    <Menu.Item key="6">删除</Menu.Item>
                                </SubMenu>
                            </Menu>,
                        ]}
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
                                    <Typography
                                        variant="overline"
                                        display="block"
                                        style={{
                                            wordBreak: 'break-all',
                                            whiteSpace: 'break-spaces',
                                            fontSize: 13,
                                        }}
                                        gutterBottom
                                    >
                                        {item.name}
                                    </Typography>
                                </div>
                            }
                            description={
                                <div style={{ maxHeight: 150, overflow: 'auto' }}>
                                    <RedTextTypography
                                        variant="overline"
                                        display="block"
                                        style={{
                                            wordBreak: 'break-all',
                                            whiteSpace: 'break-spaces',
                                            fontSize: 12,
                                            marginBottom: 0
                                        }}
                                        gutterBottom
                                    >
                                        {`评分: ${item.stars}`}
                                    </RedTextTypography>
                                    <RedTextTypography
                                        variant="overline"
                                        display="block"
                                        style={{
                                            wordBreak: 'break-all',
                                            whiteSpace: 'break-spaces',
                                            fontSize: 12,
                                            marginBottom: 0
                                        }}
                                        gutterBottom
                                    >
                                        {`标签: ${item.subjects}`}
                                    </RedTextTypography>
                                </div>
                            }
                        />
                    </Card>
                </AntList.Item>
            )}
        />
    );
}
