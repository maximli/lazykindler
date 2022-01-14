import { FC, useEffect, useState } from 'react';
import { Image } from 'antd';
import { getCover } from '@/services';

type CoverProps = {
    uuid: string;
};
const Cover: FC<CoverProps> = (props: CoverProps) => {
    const { uuid } = props;

    const [base64Cover, setBase64Cover] = useState<string>('');

    useEffect(() => {
        getCover(uuid).then((data: any) => {
            setBase64Cover(data);
        });
    }, []);

    return (
        <div>
            {base64Cover.startsWith('data:image') ? (
                <Image src={`${base64Cover}`} width="139" height="200" />
            ) : (
                <Image src={`data:image/gif;base64,${base64Cover}`} width="139" height="200" />
            )}
        </div>
    );
};

export default Cover;
