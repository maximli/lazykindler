import { axiosInstance } from './axios';

// 获取书籍集合列表
export const getAllCollections = () => {
    return axiosInstance.get(`/api/collection/get`).then((data: any) => {
        return data.data;
    });
};

// 获取指定书籍集合
export const getSpecificCollection = (uuid: string) => {
    return axiosInstance.get(`/api/collection/get/one?uuid=${uuid}`).then((data: any) => {
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
    return axiosInstance.post(`/api/collection/create`, {
        name,
        description,
        subjects,
        stars,
        cover,
    });
};

// 更新集合信息
export const updateBookCollection = (uuid: string, key: string, value: string) => {
    return axiosInstance.post(`/api/collection/update`, {
        uuid,
        key,
        value,
    });
};

// 获取书籍集合列表
export const deleteBookCollection = (uuid: string, name: string) => {
    return axiosInstance
        .delete(`/api/collection/delete?uuid=${uuid}&name=${name}`)
        .then((data: any) => {
            return data.data;
        });
};
