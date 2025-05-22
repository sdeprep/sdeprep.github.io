import React from 'react';

interface SidebarOpenerProps {
    parentSidebarPosition?: string; // Rename prop
    setIsParentSidebarHidden?: (isHidden: boolean) => void;
}

const SidebarOpener: React.FC<SidebarOpenerProps> = ({ parentSidebarPosition }) => {
    let positionClasses = '';
    let transformClasses = '';

    switch (parentSidebarPosition) {
        case 'left':
            positionClasses = 'right-[-7%] top-1/2';
            transformClasses = '-translate-y-1/2';
            break;
        case 'right':
            positionClasses = 'left-[-7%] top-1/2';
            transformClasses = '-translate-y-1/2';
            break;
        case 'bottom':
            positionClasses = 'top-[-7%] left-1/2';
            transformClasses = '-translate-x-1/2';
            break;
        default:
            positionClasses = 'top-1/2 left-1/2';
            transformClasses = '-translate-x-1/2 -translate-y-1/2';
    }

    return (
        <div
            className={`absolute w-[7%] h-[7%] border border-black bg-gray-500 rounded-[15%] ${positionClasses} ${transformClasses}`}
        ></div>
    );
};

export default SidebarOpener; 