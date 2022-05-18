import { axiosInstance } from './axios';

// 获取剪切列表
export const getAllClippings = () => {
    return axiosInstance.get(`/api/clipping/get/all`).then((data: any) => {
        return data.data;
    });
};

// 获取指定uuids的摘抄列表
//
// uuids是以分号连接的摘抄uuid字符串
export const getClippingByUUIDs = (uuids: string) => {
    return axiosInstance.get(`/api/clipping/get/uuids?uuids=${uuids}`).then((data: any) => {
        return data.data;
    });
};

// 删除摘抄
export const deleteClipping = (uuid: string) => {
    return axiosInstance.delete(`/api/clipping/delete?uuid=${uuid}`).then((data: any) => {
        return data.data;
    });
};

// 修改clipping信息
export const updateClipping = async (uuid: string, key: string, value: any) => {
    if (value == null) {
        value = '';
    }
    const data = await axiosInstance.post(`/api/clipping/update`, {
        uuid: uuid,
        key: key,
        value: value,
    });
    return data.data;
};

// 删除所有摘抄
export const deleteAllClipping = () => {
    return axiosInstance.delete(`/api/clipping/delete/all`);
};

// 添加高亮
export const addHighlight = async (uuid: string, highlight: string) => {
    const data = await axiosInstance.post(`/api/clipping/highlight/add`, {
        uuid: uuid,
        highlight,
    });
    return data.data;
};

// 删除高亮
export const deleteHighlight = async (uuid: string, highlight: string) => {
    const data = await axiosInstance.post(`/api/clipping/highlight/delete`, {
        uuid: uuid,
        highlight,
    });
    return data.data;
};
