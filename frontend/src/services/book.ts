import { axiosInstance } from './axios';

// 获取全部书籍信息列表
export const getBooksMeta = (storeType: string) => {
    return axiosInstance.get(`/api/book/all_meta?storeType=${storeType}`).then((data: any) => {
        return data.data;
    });
};

// 获取封面
export const getCover = (uuid: string) => {
    return axiosInstance.get(`/api/book/cover?uuid=${uuid}`).then((data: any) => {
        return data.data;
    });
};

// 修改书籍元数据信息
export const updateBookMeta = async (uuid: string, key: string, value: any) => {
    const data = await axiosInstance.post(`/api/book/update/book_meta`, {
        uuid,
        key,
        value,
    });
    return data.data;
};

// 删除书籍
export const deleteBook = (uuid: string) => {
    return axiosInstance.delete(`/api/book/delete?uuid=${uuid}`).then((data: any) => {
        return data.data;
    });
};
