export type Member = {
    avatar: string;
    name: string;
    id: string;
};

export interface Params {
    count: number;
}
export interface BookMetaDataType {
    author: string;
    create_time: string;
    description: string;
    done_dates: string;
    id: number;
    md5: string;
    name: string;
    publisher: string;
    size: number;
    stars: number;
    subjects: string;
    uuid: string;
    collection_names: string;
}