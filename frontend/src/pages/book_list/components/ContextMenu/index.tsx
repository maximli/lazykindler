import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import * as React from 'react';

type RightClickMenu = {
    prefixIcon: any;
    name: any;
    handler: any;
};

type ContextMenuProps = {
    Content: any;
    MenuInfo: RightClickMenu[];
};

export default function ContextMenu(props: ContextMenuProps) {
    const { Content, MenuInfo } = props;

    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX - 2,
                      mouseY: event.clientY - 4,
                  }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                  null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    return (
        <div onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
            {React.isValidElement(Content) == true ? (
                <div>{Content}</div>
            ) : (
                <Typography>{Content}</Typography>
            )}

            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                {_.map(MenuInfo, (item: RightClickMenu, index: number) => {
                    return (
                        <MenuItem
                            style={{ width: 190 }}
                            onClick={() => {
                                item.handler();
                                setContextMenu(null);
                            }}
                            key={index}
                        >
                            {React.isValidElement(item.prefixIcon) == true ? (
                                <ListItemIcon>
                                    {item.prefixIcon}
                                </ListItemIcon>
                            ) : null}
                            <ListItemText>{item.name}</ListItemText>
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
}
