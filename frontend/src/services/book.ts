import { axiosInstance } from './axios';

// 获取全部书籍信息列表
export const getBooksMeta = (storeType: string) => {
    return axiosInstance.get(`/api/book/all_meta?storeType=${storeType}`).then((data: any) => {
        return data.data;
    });
};

// 获取指定uuids的书籍列表
//
// uuids是以分号连接的书籍uuid字符串
export const getBooksMetaByUUIDs = (uuids: string) => {
    return axiosInstance.get(`/api/book/get/uuids?uuids=${uuids}`).then((data: any) => {
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
    if (value == null) {
        value = ""
    }
    const data = await axiosInstance.post(`/api/book/update/book_meta`, {
        uuid: uuid,
        key: key,
        value: value,
    });
    return data.data;
};

// 删除书籍
export const deleteBook = (uuid: string) => {
    return axiosInstance.delete(`/api/book/delete?uuid=${uuid}`).then((data: any) => {
        return data.data;
    });
};

// 根据关键词删除书籍
export const deleteBookByKeyword = (keyword: string, value: string) => {
    return axiosInstance.delete(`/api/book/delete/bykeyword?keyword=${keyword}&value=${value}`).then((data: any) => {
        return data.data;
    });
};