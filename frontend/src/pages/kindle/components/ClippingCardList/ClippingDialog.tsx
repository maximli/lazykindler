import { ClippingDataType } from '@/pages/data';
import { addHighlight, deleteHighlight, getClippingByUUIDs } from '@/services';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';

import styles from './index.less';

type ClippingDialogProps = {
    uuid: string;
    open: boolean;
    handleClose: any;
    clippingContent: string;
    highlights: any;
    book_name: string;
    fetchClippings: any;
};

const initialHighlightInfo = {
    uuid: '',
    selectedText: '',
    open: false,
};

export default function ClippingDialog(props: ClippingDialogProps) {
    const { uuid, open, handleClose, clippingContent, highlights, book_name, fetchClippings } =
        props;

    const [clippingHighlights, setClippingHighlights] = useState<string[]>([]);

    const [highlighInfo, setHighlightInfo] = useState(initialHighlightInfo);

    const getClipping = () => {
        getClippingByUUIDs(uuid).then((data: ClippingDataType[]) => {
            setClippingHighlights(data[0].highlights);
        });
    };

    useEffect(() => {
        setClippingHighlights(highlights);
    }, [highlights]);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">{`来自的《${book_name} 》笔记`}</DialogTitle>
                <DialogContent>
                    <Typography
                        variant="body1"
                        gutterBottom
                        className={styles.cardItemContent}
                        style={{
                            height: '100%',
                            paddingTop: 10,
                            fontSize: 15,
                            whiteSpace: 'pre-wrap',
                        }}
                        onMouseUp={() => {
                            let selectedText = window.getSelection()!.toString();
                            if (selectedText != '') {
                                let info = {
                                    open: true,
                                    selectedText: selectedText,
                                    uuid: uuid,
                                };
                                setHighlightInfo(info);
                            }
                        }}
                    >
                        <Highlighter
                            highlightStyle={{ color: 'red' }}
                            searchWords={clippingHighlights || []}
                            autoEscape={true}
                            textToHighlight={clippingContent || ''}
                        />
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                </DialogActions>
            </Dialog>

            <div>
                <Dialog
                    open={highlighInfo.open}
                    onClose={() => {
                        setHighlightInfo(initialHighlightInfo);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                >
                    <DialogTitle id="alert-dialog-title">高亮操作</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            请选择要进行的操作! (要删除高亮部分，请完整选择某一高亮部分。否则
                            "删除高亮" 操作不会成功执行)
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setHighlightInfo(initialHighlightInfo);
                            }}
                        >
                            取消
                        </Button>
                        <Button
                            onClick={() => {
                                setHighlightInfo(initialHighlightInfo);
                                deleteHighlight(highlighInfo.uuid, highlighInfo.selectedText).then(
                                    () => {
                                        getClipping();
                                        fetchClippings();
                                    },
                                );
                            }}
                        >
                            删除高亮
                        </Button>
                        <Button
                            onClick={() => {
                                addHighlight(highlighInfo.uuid, highlighInfo.selectedText).then(
                                    () => {
                                        getClipping();
                                        fetchClippings();
                                    },
                                );
                                setHighlightInfo(initialHighlightInfo);
                            }}
                            autoFocus
                        >
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}
