import { ClippingDataType } from '@/pages/data';
import { GridContent } from '@ant-design/pro-layout';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import { Card } from 'antd';
import moment from 'moment';
import { useState } from 'react';

import styles from './index.less';

type ClippingCardListProps = {
    data: any;
    fetchClippings: any;
};

const ClippingCardList = (props: ClippingCardListProps) => {
    const { data, fetchClippings } = props;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <GridContent>
            <Box sx={{ overflowY: 'scroll' }} style={{ height: "83vh" }}>
                <ImageList variant="masonry" cols={4} gap={15}>
                    {data
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((item: ClippingDataType) => (
                            <ImageListItem key={item.uuid}>
                                <Card className={styles.card} hoverable>
                                    <Card.Meta
                                        title={<a>{item.book_name}</a>}
                                        description={
                                            <div>
                                                作者:{' '}
                                                <span style={{ paddingLeft: 30 }}>
                                                    {item.author}
                                                </span>
                                                <br />
                                                添加日期:{' '}
                                                <span style={{ paddingLeft: 1 }}>
                                                    {moment
                                                        .unix(~~item.addDate)
                                                        .format('yyyy-MM-DD HH:mm:ss')}
                                                </span>
                                            </div>
                                        }
                                    />
                                    <Typography
                                        variant="body1"
                                        gutterBottom
                                        className={styles.cardItemContent}
                                        style={{
                                            height: '100%',
                                            paddingTop: 10,
                                            fontSize: 15,
                                        }}
                                    >
                                        {item.content}
                                    </Typography>
                                </Card>
                            </ImageListItem>
                        ))}
                </ImageList>
                <TablePagination
                    rowsPerPageOptions={[15, 25, 50]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage={<div style={{ paddingTop: 13.5 }}>每页数目</div>}
                    labelDisplayedRows={(paginationInfo: any) => (
                        <div style={{ paddingTop: 13.5 }}>
                            {paginationInfo.from}-{paginationInfo.to}---总共:{paginationInfo.count}
                        </div>
                    )}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </GridContent>
    );
};

export default ClippingCardList;
