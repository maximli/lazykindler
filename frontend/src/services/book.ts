import { axiosInstance } from "./axios";


// 获取全部书籍信息列表
export const getAllBooksMeta = () => {
    return axiosInstance
        .get(`/api/book/all_meta`)
        .then((data: any) => {
            return data.data;
        });
};
