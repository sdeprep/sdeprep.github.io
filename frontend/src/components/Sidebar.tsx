import React, { useState } from 'react';
import SidebarOpener from './SidebarOpener';

interface SidebarProps {
    position: string;
}

const positionStyles: { [key: string]: { [key: string]: string } } = {
    left: {
        bgColorClass: 'bg-blue-200',
        borderColorClass: 'border-blue-700',
        textColorClass: 'text-blue-800',
        positionClasses: 'fixed top-0 h-screen w-64',
        peekPositionClasses: '-left-63', // Shows 4px peek
    },
    bottom: {
        bgColorClass: 'bg-green-200',
        borderColorClass: 'border-green-700',
        textColorClass: 'text-green-800',
        positionClasses: 'fixed left-0 right-0 h-48',
        peekPositionClasses: '-bottom-47', // Shows 4px peek
    },
    right: {
        bgColorClass: 'bg-red-200',
        borderColorClass: 'border-red-700',
        textColorClass: 'text-red-800',
        positionClasses: 'fixed top-0 h-screen w-64',
        peekPositionClasses: '-right-63', // Shows 4px peek
    },
    default: {
        bgColorClass: 'bg-gray-200',
        borderColorClass: 'border-gray-700',
        textColorClass: 'text-gray-800',
        positionClasses: '',
        peekPositionClasses: '',
    }
};

const Sidebar: React.FC<SidebarProps> = ({ position }) => {
    const [isHidden, setIsHidden] = useState(true);

    const transitionClasses = 'transition-all duration-300 ease-in-out';

    const styles = positionStyles[position] || positionStyles.default;

    const currentPositionClass = isHidden ? styles.peekPositionClasses : (position === 'left' ? 'left-0' : (position === 'right' ? 'right-0' : (position === 'bottom' ? 'bottom-0' : '')));

    const sidebarStyles: { [key: string]: React.CSSProperties } = {
        left: { borderTopRightRadius: '12px', borderBottomRightRadius: '12px' },
        right: { borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' },
        bottom: { borderTopLeftRadius: '12px', borderTopRightRadius: '12px' },
        default: {},
    };

    return (
        <div
            className={`sidebar p-4 border-4 flex justify-center items-center ${styles.bgColorClass} ${styles.borderColorClass} ${styles.textColorClass} ${styles.positionClasses} ${currentPositionClass} ${transitionClasses}`}
            style={{ ...sidebarStyles[position], zIndex: 10 }}
            onMouseEnter={() => setIsHidden(false)}
            onMouseLeave={() => setIsHidden(true)}
        >
            <SidebarOpener parentSidebarPosition={position} setIsParentSidebarHidden={setIsHidden} />
            {position} sidebar
        </div>
    );
};

export default Sidebar;