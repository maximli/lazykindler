import { axiosInstance } from './axios';

// 获取书籍集合列表
export const getBookCollections = () => {
    return axiosInstance.get(`/api/collection/get`).then((data: any) => {
        return data.data;
    });
};

// 创建书籍集合
export const createBookCollection = (
    name: string,
    description: string,
    subjects: string,
    stars: number,
    cover: string,
) => {
    return axiosInstance
        .post(`/api/collection/create`, {
            name,
            description,
            subjects,
            stars,
            cover,
        })
        .then((data: any) => {
            return data.data;
        });
};
