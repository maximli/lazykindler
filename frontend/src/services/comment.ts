import { axiosInstance } from './axios';

// 获取关联的评论列表
export const getCommentsByRelatedUUID = (related_uuid: string) => {
    return axiosInstance
        .get(`/api/comment/get/by_related_uuid?related_uuid=${related_uuid}`)
        .then((data: any) => {
            return data.data;
        });
};

// 创建评论
export const createComment = async (related_uuid: string, content: string) => {
    const data = await axiosInstance.post(`/api/comment/create`, {
        related_uuid,
        content,
    });
    return data.data;
};

// 修改评论
export const updateComment = async (uuid: string, newContent: string) => {
    const data = await axiosInstance.post(`/api/comment/update`, {
        uuid,
        newContent,
    });
    return data.data;
};

// 删除评论
export const deleteComment = (uuid: string) => {
    return axiosInstance.delete(`/api/comment/delete?uuid=${uuid}`).then((data: any) => {
        return data.data;
    });
};
