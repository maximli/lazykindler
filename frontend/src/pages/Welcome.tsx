import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Card } from 'antd';
import React from 'react';

const Welcome: React.FC = () => {
    return (
        <PageContainer>
            <Card>
                <Alert
                    message={
                        '正在积极添加新功能，欢迎提issue，github地址: https://github.com/leowucn/lazykindler。'
                    }
                    type="success"
                    showIcon
                    banner
                    style={{
                        margin: -12,
                        marginBottom: 24,
                    }}
                />
            </Card>
        </PageContainer>
    );
};

export default Welcome;
