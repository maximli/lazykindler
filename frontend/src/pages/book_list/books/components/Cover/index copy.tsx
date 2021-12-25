import { getBookCover } from '@/services';
import { FC, useEffect, useState } from 'react';

type CoverProps = {
    uuid: string
}
const Cover: FC<CoverProps> = (props: CoverProps) => {
    const {uuid} = props;

    const [base64Cover, setBase64Cover] = useState<string>("")

    useEffect(() => {
        getBookCover(uuid)
        .then(data => {
            setBase64Cover(data);
        })
    }, [])

    return (
        <div>
            <img src={`data:image/gif;base64,${base64Cover}`} width="139" height="200" />
        </div>
    )
}

export default Cover;