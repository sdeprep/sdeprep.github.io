import React, { useState } from 'react';
import SidebarOpener from './SidebarOpener';

interface SidebarProps {
    position: string;
}

const positionStyles: { [key: string]: { [key: string]: string } } = {
    left: {
        bgColorClass: 'bg-blue-200',
        borderColorClass: 'border-blue-800',
        textColorClass: 'text-blue-800',
        positionClasses: 'left-0 top-0 h-screen w-24',
    },
    bottom: {
        bgColorClass: 'bg-green-200',
        borderColorClass: 'border-green-800',
        textColorClass: 'text-green-800',
        positionClasses: 'bottom-0 left-0 right-0 h-24',
    },
    right: {
        bgColorClass: 'bg-red-200',
        borderColorClass: 'border-red-800',
        textColorClass: 'text-red-800',
        positionClasses: 'right-0 top-0 h-screen w-24',
    }
};

const Sidebar: React.FC<SidebarProps> = ({ position }) => {
    const [isHidden, setIsHidden] = useState(true);

    const transitionClasses = 'transition-all duration-300 ease-in-out';

    const currentPositionClass = isHidden ? 'opacity-0' : 'opacity-100';

    const styles = positionStyles[position] || {
        bgColorClass: 'bg-gray-200',
        borderColorClass: 'border-gray-800',
        textColorClass: 'text-gray-800',
        positionClasses: '',
    };

    const sidebarStyles: { [key: string]: { [key: string]: string } } = {
        left: { position: 'fixed', left: '0', top: '0', height: '100vh', width: '6rem' },
        bottom: { position: 'fixed', bottom: '0', left: '0', right: '0', height: '6rem' },
        right: { position: 'fixed', right: '0', top: '0', height: '100vh', width: '6rem' },
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