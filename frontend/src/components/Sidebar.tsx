import React, { useState } from 'react';
import SidebarOpener from './SidebarOpener';

interface SidebarProps {
    position: string;
    isAdminMode?: boolean;
    onToggleAdmin?: () => void;
    onShowReference?: () => void;
    showReference?: boolean;
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

const Sidebar: React.FC<SidebarProps> = ({
    position,
    isAdminMode,
    onToggleAdmin,
    onShowReference,
    showReference
}) => {
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

    const toggleSwitchStyle = {
        position: 'relative' as const,
        width: '60px',
        height: '30px',
        backgroundColor: isAdminMode ? '#007acc' : '#ccc',
        borderRadius: '15px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        margin: '10px 0'
    };

    const toggleKnobStyle = {
        position: 'absolute' as const,
        top: '3px',
        left: isAdminMode ? '33px' : '3px',
        width: '24px',
        height: '24px',
        backgroundColor: 'white',
        borderRadius: '50%',
        transition: 'left 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    const referenceButtonStyle = {
        padding: '10px 20px',
        margin: '10px 0',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        width: '100%',
        color: 'white',
        backgroundColor: showReference ? '#6c757d' : '#28a745',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const adminLabelStyle = {
        fontSize: '12px',
        fontWeight: '600',
        color: '#495057',
        marginBottom: '5px',
        textAlign: 'center' as const
    };

    return (
        <div
            className={`sidebar p-4 border-4 flex flex-col justify-center items-center ${styles.bgColorClass} ${styles.borderColorClass} ${styles.textColorClass} ${styles.positionClasses} ${currentPositionClass} ${transitionClasses}`}
            style={{ ...sidebarStyles[position], zIndex: 10 }}
            onMouseEnter={() => setIsHidden(false)}
            onMouseLeave={() => setIsHidden(true)}
        >
            <SidebarOpener parentSidebarPosition={position} setIsParentSidebarHidden={setIsHidden} />

            {position === 'right' && (
                <div style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
                    {/* Admin Mode Toggle */}
                    <div style={adminLabelStyle}>Admin Mode</div>
                    <div style={toggleSwitchStyle} onClick={onToggleAdmin}>
                        <div style={toggleKnobStyle}></div>
                    </div>

                    {/* Reference Button - only show when admin mode is on */}
                    {isAdminMode && (
                        <button
                            style={referenceButtonStyle}
                            onClick={onShowReference}
                        >
                            {showReference ? '← Main' : '📚 References'}
                        </button>
                    )}
                </div>
            )}

            {position !== 'right' && (
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#6c757d' }}>
                    {position === 'left' && '❓ Questions'}
                    {position === 'bottom' && '🤖 AI Interaction'}
                </div>
            )}
        </div>
    );
};

export default Sidebar;