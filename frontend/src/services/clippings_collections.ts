import { axiosInstance } from './axios';

// 获取摘抄集合
export const getMultipleClippingsCollections = (uuids: string[]) => {
    return axiosInstance.get(`/api/clippings_collection/get/multiple?uuids=${uuids.join(";")}`).then((data: any) => {
        return data.data;
    });
};
