import React from 'react';

interface SidebarProps {
    position: string;
}

const Sidebar: React.FC<SidebarProps> = ({ position }) => {
    let bgColorClass = '';
    let borderColorClass = '';
    let textColorClass = '';
    let positionClasses = '';

    switch (position) {
        case 'left':
            bgColorClass = 'bg-blue-200';
            borderColorClass = 'border-blue-700';
            textColorClass = 'text-blue-800';
            positionClasses = 'fixed top-0 left-0 h-screen w-64 rounded-r-lg';
            break;
        case 'bottom':
            bgColorClass = 'bg-green-200';
            borderColorClass = 'border-green-700';
            textColorClass = 'text-green-800';
            positionClasses = 'fixed bottom-0 left-0 right-0 h-48 rounded-t-lg';
            break;
        case 'right':
            bgColorClass = 'bg-red-200';
            borderColorClass = 'border-red-700';
            textColorClass = 'text-red-800';
            positionClasses = 'fixed top-0 right-0 h-screen w-64 rounded-l-lg';
            break;
        default:
            bgColorClass = 'bg-gray-200';
            borderColorClass = 'border-gray-700';
            textColorClass = 'text-gray-800';
            positionClasses = '';
    }

    return (
        <div className={`sidebar p-4 border-4 ${bgColorClass} ${borderColorClass} ${textColorClass} ${positionClasses}`}>
            {position} sidebar
        </div>
    );
};

export default Sidebar; 