import { ClippingDataType, CommentDataType } from '@/pages/data';
import { addHighlight, deleteHighlight, getClippingByUUIDs } from '@/services';
import { createComment, deleteComment, getCommentsByRelatedUUID } from '@/services/comment';
import { getRandomInt } from '@/util';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button as AntdButton, Avatar, Comment, Form, Input } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';

import styles from './index.less';

const { TextArea } = Input;

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

const initialDeleteCommentInfo = {
    open: false,
    comment_uuid: '',
};

const Editor = ({ onChange, onSubmit, submitting, value }: any) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <AntdButton htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                添加评论
            </AntdButton>
        </Form.Item>
    </>
);

export default function ClippingDialog(props: ClippingDialogProps) {
    const { uuid, open, handleClose, clippingContent, highlights, book_name, fetchClippings } =
        props;

    const [clippingHighlights, setClippingHighlights] = useState<string[]>([]);

    const [comments, setComments] = useState<CommentDataType[]>([]);
    const [textArea, setTextArea] = useState<string>('');
    const [deleteCommentInfo, setDeleteCommentInfo] = useState<any>(initialDeleteCommentInfo);
    const [submitting, setSubmitting] = useState(false);

    const [highlighInfo, setHighlightInfo] = useState(initialHighlightInfo);

    const getClipping = () => {
        getClippingByUUIDs(uuid).then((data: ClippingDataType[]) => {
            setClippingHighlights(data[0].highlights);
        });
    };

    useEffect(() => {
        setClippingHighlights(highlights);
    }, [highlights]);

    const getComments = (uuid: string) => {
        getCommentsByRelatedUUID(uuid).then((data) => {
            setComments(data);
        });
    };

    useEffect(() => {
        getComments(uuid);
    }, [uuid]);

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
                    <br />
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
                            // style={{ fontSize: 17 }}
                            highlightStyle={{ color: 'red' }}
                            searchWords={clippingHighlights || []}
                            autoEscape={true}
                            textToHighlight={clippingContent || ''}
                        />
                    </Typography>
                    <br />
                    <br />

                    {comments.length > 1 && `${comments.length}条评论`}
                    <Divider />

                    <div style={{ maxHeight: 320, overflow: 'auto' }}>
                        {comments.length > 0 &&
                            _.map(comments, (item: CommentDataType, index: number) => {
                                return (
                                    <Comment
                                        key={index}
                                        actions={[
                                            <span
                                                key="comment-list-reply-to-0"
                                                onClick={() => {
                                                    setDeleteCommentInfo({
                                                        open: true,
                                                        comment_uuid: item.uuid,
                                                    });
                                                }}
                                            >
                                                删除
                                            </span>,
                                        ]}
                                        author={'天外来客'}
                                        avatar={`/avatar/${getRandomInt(1, 16)}.svg`}
                                        content={<p>{item.content}</p>}
                                        datetime={moment(item.create_time).fromNow()}
                                    />
                                );
                            })}
                    </div>
                    <Comment
                        avatar={
                            <Avatar src={`/avatar/${getRandomInt(1, 16)}.svg`} alt="Han Solo" />
                        }
                        content={
                            <Editor
                                onChange={(e: any) => {
                                    setTextArea(e.target.value);
                                }}
                                onSubmit={() => {
                                    if (textArea == '') {
                                        return;
                                    }
                                    setSubmitting(true);
                                    setTimeout(() => {
                                        createComment(uuid, textArea).then(() => {
                                            getComments(uuid);
                                        });
                                        setTextArea('');
                                        setSubmitting(false);
                                    }, 600);
                                }}
                                submitting={submitting}
                                value={textArea}
                            />
                        }
                    />
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

            <div>
                <Dialog
                    open={deleteCommentInfo.open}
                    onClose={() => {
                        setDeleteCommentInfo(initialDeleteCommentInfo);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                >
                    <DialogTitle id="alert-dialog-title">警告</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            确定删除该评论吗？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setDeleteCommentInfo(initialDeleteCommentInfo);
                            }}
                        >
                            取消
                        </Button>
                        <Button
                            onClick={() => {
                                deleteComment(deleteCommentInfo.comment_uuid).then(() => {
                                    getComments(uuid);
                                });
                                setDeleteCommentInfo(initialDeleteCommentInfo);
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
