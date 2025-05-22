import React from 'react';

interface SidebarOpenerProps {
    parentSidebarPosition?: string; // Rename prop
    setIsParentSidebarHidden?: (isHidden: boolean) => void;
}

const SidebarOpener: React.FC<SidebarOpenerProps> = ({ parentSidebarPosition }) => {
    const openerStyle: React.CSSProperties = {
        position: 'absolute',
        width: '7%', // Small rectangle width, relative to parent
        height: '7%', // Small rectangle height, relative to parent
        border: '1px solid black',
        backgroundColor: 'gray',
        borderRadius: '15%', // Keep reduced rounding
    };

    switch (parentSidebarPosition) {
        case 'left':
            openerStyle.right = '-7%'; // Position outside on the right edge
            openerStyle.top = '50%';
            openerStyle.transform = 'translateY(-50%)';
            break;
        case 'right':
            openerStyle.left = '-7%'; // Position outside on the left edge
            openerStyle.top = '50%';
            openerStyle.transform = 'translateY(-50%)';
            break;
        case 'bottom':
            openerStyle.top = '-7%'; // Position outside on the top edge
            openerStyle.left = '50%';
            openerStyle.transform = 'translateX(-50%)';
            break;
        default:
            // Default to centered inside if no position is provided or is invalid
            openerStyle.top = '50%';
            openerStyle.left = '50%';
            openerStyle.transform = 'translate(-50%, -50%)';
    }

    return (
        <div
            style={openerStyle}
        ></div>
    );
};

export default SidebarOpener; 