import { axiosInstance } from "./axios";


// 获取全部书籍信息列表
export const getBooksMeta = (storeType: string) => {
    return axiosInstance
        .get(`/api/book/all_meta?storeType=${storeType}`)
        .then((data: any) => {
            return data.data;
        });
};


// 获取书籍封面
export const getBookCover = (uuid: string) => {
    return axiosInstance
        .get(`/api/book/cover?uuid=${uuid}`)
        .then((data: any) => {
            return data.data;
        });
};