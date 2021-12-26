import { useWindowDimensions } from '@/util';
import { Paper } from '@mui/material';

const PaperWrapper = ({ children }: any) => {
    const { height } = useWindowDimensions();

    return <Paper style={{ height: height - 95 }}>{children}</Paper>;
};

export default PaperWrapper;
