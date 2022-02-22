import { ClippingDataType } from '@/pages/data';
import { getAllClippings } from '@/services';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { List } from 'antd';
import { Card } from 'antd';
import { useEffect, useState } from 'react';

import styles from './index.less';

const Clippings = () => {
    const [data, setData] = useState<ClippingDataType[]>([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    useEffect(() => {
        getAllClippings().then((data: ClippingDataType[]) => {
            setData(data);
            console.log('aa11------------data = ', data);
        });
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Box sx={{ overflowY: 'scroll' }}>
            <ImageList variant="masonry" cols={4} gap={15}>
                {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: ClippingDataType) => (
                        <ImageListItem key={item.uuid}>
                            <Card className={styles.card} hoverable>
                                <Card.Meta
                                    title={<a>{item.book_name}</a>}
                                    description={item.author}
                                />
                                <div
                                    className={styles.cardItemContent}
                                    style={{ height: '100%', paddingTop: 10 }}
                                >
                                    {/* <span>{moment.unix(~~item.addDate).format('MMMM Do YYYY, h:mm:ss a')}</span> */}
                                    {item.content}
                                </div>
                            </Card>
                        </ImageListItem>
                    ))}
            </ImageList>
            <TablePagination
                rowsPerPageOptions={[15, 25, 50]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage={"每页数目"}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
};

export default Clippings;
