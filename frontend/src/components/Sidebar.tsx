import React, { useState } from 'react';
import SidebarOpener from './SidebarOpener';

interface SidebarProps {
    position: string;
}

const Sidebar: React.FC<SidebarProps> = ({ position }) => {
    const [isHidden, setIsHidden] = useState(true);

    let bgColorClass = '';
    let borderColorClass = '';
    let textColorClass = '';
    let positionClasses = '';
    let transitionClasses = 'transition-all duration-300 ease-in-out';
    let hiddenPositionClasses = '';

    switch (position) {
        case 'left':
            bgColorClass = 'bg-blue-200';
            borderColorClass = 'border-blue-700';
            textColorClass = 'text-blue-800';
            positionClasses = 'fixed top-0 h-screen w-64';
            hiddenPositionClasses = '-left-64';
            break;
        case 'bottom':
            bgColorClass = 'bg-green-200';
            borderColorClass = 'border-green-700';
            textColorClass = 'text-green-800';
            positionClasses = 'fixed left-0 right-0 h-48';
            hiddenPositionClasses = '-bottom-48';
            break;
        case 'right':
            bgColorClass = 'bg-red-200';
            borderColorClass = 'border-red-700';
            textColorClass = 'text-red-800';
            positionClasses = 'fixed top-0 h-screen w-64';
            hiddenPositionClasses = '-right-64';
            break;
        default:
            bgColorClass = 'bg-gray-200';
            borderColorClass = 'border-gray-700';
            textColorClass = 'text-gray-800';
            positionClasses = '';
            hiddenPositionClasses = '';
    }

    const currentPositionClass = isHidden ? hiddenPositionClasses : (position === 'left' ? 'left-0' : (position === 'right' ? 'right-0' : (position === 'bottom' ? 'bottom-0' : '')));

    return (
        <div
            className={`sidebar p-4 border-4 flex justify-center items-center ${bgColorClass} ${borderColorClass} ${textColorClass} ${positionClasses} ${currentPositionClass} ${transitionClasses}`}
            onMouseEnter={() => setIsHidden(false)}
            onMouseLeave={() => setIsHidden(true)}
        >
            <SidebarOpener parentSidebarPosition={position} setIsParentSidebarHidden={setIsHidden} />
            {position} sidebar
        </div>
    );
};

export default Sidebar; 