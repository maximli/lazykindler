import _ from 'lodash';
import { useEffect, useState } from 'react';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

// 用于获取当前窗口的宽高
export const useWindowDimensions: any = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
};

export const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const preHandleSubjects = (subjects: string) => {
    let subjectsList = subjects.trim().split(';');
    subjectsList = _.map(subjectsList, (subject) => {
        return subject.trim();
    });
    subjectsList = _.uniq(subjectsList);
    return subjectsList.join(';');
};

export const humanFileSize = (bytes: any, si = false, dp = 1) => {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
};

export const countChOfStr = (str: string, c: string) => {
    if (str == null) {
        return 0;
    }
    var result = 0,
        i = 0;
    for (i; i < str.length; i++) if (str[i] == c) result++;
    return result + 1;
};

export const convertRange = (value: any, r1: any, r2: any) => {
    let v = ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
    return Math.floor(v);
};

export const handleClippingContent = (content: string) => {
    if (content == null) {
        return '';
    }
    const arr = content.split('\n');
    let newArr: string[] = _.map(arr, (item: string) => {
        return '        ' + item;
    });
    console.log(newArr);
    return newArr.join('\n');
};
