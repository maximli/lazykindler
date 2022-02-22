import { axiosInstance } from './axios';

// 获取剪切列表
export const getAllClippings = () => {
    return axiosInstance.get(`/api/clippings/get/all`).then((data: any) => {
        return data.data;
    });
};
