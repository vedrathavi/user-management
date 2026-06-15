interface FilterMenuProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const FilterMenu = ({ isOpen, onClose, children }: FilterMenuProps) => { 

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

            {/* Menu */}
            <div className="fixed z-50 w-64 rounded-lg bg-neutral-900 p-4">
                {children}
            </div>

        </>
    );
};

export default FilterMenu;

