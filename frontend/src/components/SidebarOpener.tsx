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
      className={`absolute w-8 h-8 border border-gray-500 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden ${positionClasses} ${transformClasses}`}
    >
      <div className="w-3 h-3 bg-gray-600 rounded-full opacity-75"></div>
    </div>
  );
};

export default SidebarOpener;
