import { Card, List as AntList } from 'antd';
import Typography from '@mui/material/Typography';

import _ from 'lodash';
import Cover from '../../../books/components/Cover';

import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { withStyles } from '@material-ui/core/styles';
import { BookMetaDataType } from '../../data';
import ChangeInfo from './changeInfo';
import { useState } from 'react';
import { updateBookMeta } from '@/services';

const { SubMenu } = Menu;

const RedTextTypography = withStyles({
    root: {
        color: '#f44336',
    },
})(Typography);

type BookCardListProps = {
    data: any;
};

const initialDialogInfo = {
    title: '',
    allowEmptyStr: false,
    handleOK: null,
    open: false,
};

export default function BookCardList(props: BookCardListProps) {
    const { data } = props;

    const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);

    const handleCloseDialog = () => {
        setDialogInfo(initialDialogInfo);
    };

    return (
        <>
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
                renderItem={(item: BookMetaDataType) => (
                    <AntList.Item>
                        <Card
                            hoverable
                            cover={<Cover uuid={item.uuid} />}
                            actions={[
                                <Menu mode="vertical" selectable={false}>
                                    <SubMenu key="sub4" icon={<SettingOutlined />} title="操作">
                                        <Menu.Item
                                            key="1"
                                            onClick={() => {
                                                setDialogInfo({
                                                    title: '修改评分',
                                                    allowEmptyStr: false,
                                                    handleOK: (newValue: any) => {
                                                        updateBookMeta(
                                                            item.uuid,
                                                            'stars',
                                                            newValue,
                                                        );
                                                    },
                                                    open: true,
                                                });
                                            }}
                                        >
                                            修改评分
                                        </Menu.Item>
                                        <Menu.Item
                                            key="2"
                                            onClick={() => {
                                                setDialogInfo({
                                                    title: '修改标签',
                                                    allowEmptyStr: false,
                                                    handleOK: (newValue: any) => {
                                                        updateBookMeta(
                                                            item.uuid,
                                                            'subjects',
                                                            newValue,
                                                        );
                                                    },
                                                    open: true,
                                                });
                                            }}
                                        >
                                            修改标签
                                        </Menu.Item>
                                        <Menu.Item
                                            key="3"
                                            onClick={() => {
                                                setDialogInfo({
                                                    title: '修改集合',
                                                    allowEmptyStr: false,
                                                    handleOK: (newValue: any) => {
                                                        updateBookMeta(
                                                            item.uuid,
                                                            'collection_names',
                                                            newValue,
                                                        );
                                                    },
                                                    open: true,
                                                });
                                            }}
                                        >
                                            修改集合
                                        </Menu.Item>
                                        <Menu.Item
                                            key="4"
                                            onClick={() => {
                                                setDialogInfo({
                                                    title: '修改作者',
                                                    allowEmptyStr: false,
                                                    handleOK: (newValue: any) => {
                                                        updateBookMeta(
                                                            item.uuid,
                                                            'author',
                                                            newValue,
                                                        );
                                                    },
                                                    open: true,
                                                });
                                            }}
                                        >
                                            修改作者
                                        </Menu.Item>
                                        <Menu.Item
                                            key="5"
                                            onClick={() => {
                                                setDialogInfo({
                                                    title: '修改出版社',
                                                    allowEmptyStr: false,
                                                    handleOK: (newValue: any) => {
                                                        updateBookMeta(
                                                            item.uuid,
                                                            'publisher',
                                                            newValue,
                                                        );
                                                    },
                                                    open: true,
                                                });
                                            }}
                                        >
                                            修改出版社
                                        </Menu.Item>
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
                                                marginBottom: 0,
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
                                                marginBottom: 0,
                                            }}
                                            gutterBottom
                                        >
                                            {`集合: ${item.collection_names}`}
                                        </RedTextTypography>
                                        <RedTextTypography
                                            variant="overline"
                                            display="block"
                                            style={{
                                                wordBreak: 'break-all',
                                                whiteSpace: 'break-spaces',
                                                fontSize: 12,
                                                marginBottom: 0,
                                            }}
                                            gutterBottom
                                        >
                                            {`标签: ${item.subjects}`}
                                        </RedTextTypography>
                                        <RedTextTypography
                                            variant="overline"
                                            display="block"
                                            style={{
                                                wordBreak: 'break-all',
                                                whiteSpace: 'break-spaces',
                                                fontSize: 12,
                                                marginBottom: 0,
                                            }}
                                            gutterBottom
                                        >
                                            {`作者: ${item.author}`}
                                        </RedTextTypography>
                                        <RedTextTypography
                                            variant="overline"
                                            display="block"
                                            style={{
                                                wordBreak: 'break-all',
                                                whiteSpace: 'break-spaces',
                                                fontSize: 12,
                                                marginBottom: 0,
                                            }}
                                            gutterBottom
                                        >
                                            {`出版社: ${item.publisher}`}
                                        </RedTextTypography>
                                    </div>
                                }
                            />
                        </Card>
                    </AntList.Item>
                )}
            />
            <ChangeInfo
                title={dialogInfo['title']}
                allowEmptyStr={dialogInfo['allowEmptyStr']}
                handleClose={handleCloseDialog}
                handleOK={dialogInfo['handleOK']}
                open={dialogInfo['open']}
            />
        </>
    );
}
