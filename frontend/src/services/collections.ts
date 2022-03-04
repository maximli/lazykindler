import { axiosInstance } from './axios';

// 获取集合列表
export const getAllCollections = (coll_type: string) => {
    return axiosInstance.get(`/api/collection/get/all?coll_type=${coll_type}`).then((data: any) => {
        return data.data;
    });
};

// 获取指定集合
export const getMultipleCollections = (uuids: string[]) => {
    return axiosInstance.get(`/api/collection/get/multiple?uuids=${uuids.join(";")}`).then((data: any) => {
        return data.data;
    });
};

// 创建集合
export const createBookCollection = (
    name: string,
    coll_type: string,
    description: string,
    subjects: string,
    stars: number,
    cover: string,
) => {
    return axiosInstance.post(`/api/collection/create`, {
        name,
        coll_type,
        description,
        subjects,
        stars,
        cover,
    });
};

// 更新集合信息
export const updateCollection = (uuid: string, key: string, value: string) => {
    return axiosInstance.post(`/api/collection/update`, {
        uuid,
        key,
        value,
    });
};

// 删除集合 (保留集合中的条目)
export const deleteCollectionWithoutBooks = (uuid: string) => {
    return axiosInstance
        .delete(`/api/collection/delete/withoutitems?uuid=${uuid}`)
        .then((data: any) => {
            return data.data;
        });
};


// 删除集合 (不保留集合中的条目)
export const deleteCollectionWithBooks = (uuid: string) => {
    return axiosInstance
        .delete(`/api/collection/delete/withitems?uuid=${uuid}`)
        .then((data: any) => {
            return data.data;
        });
};

// 根据关键词删除集合 (不保留集合中的条目)
export const deleteCollectionByKeyword = (keyword: string, value: string) => {
    return axiosInstance.delete(`/api/collection/delete/bykeyword?keyword=${keyword}&value=${value}`).then((data: any) => {
        return data.data;
    });
};