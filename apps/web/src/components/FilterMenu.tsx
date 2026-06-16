import { useState } from "react";

interface FilterMenuProps {
  field: string;
  options: string[];
  selectedValues: string[];
  onToggle: (field: string, value: string) => void;
  onSelectAll: (field: string, allValues: string[]) => void;
  onClearAll: (field: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSort?: (field: string) => void;
  sort?: { field: string; order: "ASC" | "DESC" } | undefined;
}

const FilterMenu = ({
  field,
  options,
  selectedValues,
  onToggle,
  onSelectAll,
  onClearAll,
  isOpen,
  onClose,
  onSort,
  sort,
}: FilterMenuProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    (option || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if all options are selected
  const isAllSelected =
    options.length > 0 &&
    options.every((option) => selectedValues.includes(option));

  const handleSelectAllChange = () => {
    if (isAllSelected) {
      onClearAll(field);
    } else {
      onSelectAll(field, options);
    }
  };

  const isCurrentSorted = sort?.field === field;

  return (
    <>
      {/* Backdrop to close the menu when clicking outside */}
      <div className="fixed inset-0 z-40 bg-black/0" onClick={onClose} />

      {/* Menu Container */}
      <div className="absolute top-full right-0 z-50 mt-2 w-64 rounded-xl border border-neutral-800 bg-neutral-950/95 p-4 shadow-2xl backdrop-blur-md text-left normal-case font-normal text-neutral-200">
        
        {/* Sorting Section */}
        {onSort && (
          <div className="mb-3 flex flex-col gap-1 border-b border-neutral-800 pb-2">
            <button
              onClick={() => onSort(field)}
              className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:bg-neutral-800 ${
                isCurrentSorted && sort.order === "ASC"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span>Sort Ascending</span>
              <span>↑</span>
            </button>
            <button
              onClick={() => onSort(field)}
              className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:bg-neutral-800 ${
                isCurrentSorted && sort.order === "DESC"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span>Sort Descending</span>
              <span>↓</span>
            </button>
          </div>
        )}

        {/* Search Input */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
          />
        </div>

        {/* Select All Option */}
        <div className="mb-2 border-b border-neutral-800 pb-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors duration-150 hover:bg-neutral-800/60">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAllChange}
              className="h-3.5 w-3.5 rounded border-neutral-700 bg-neutral-900 text-blue-600 accent-blue-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>Select All</span>
          </label>
        </div>

        {/* Checkbox Options List */}
        <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent pr-1 flex flex-col gap-0.5">
          {filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-xs text-neutral-500">
              No values match
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isChecked = selectedValues.includes(option);
              return (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-neutral-300 transition-colors duration-150 hover:bg-neutral-800/40 hover:text-neutral-100"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggle(field, option)}
                    className="h-3.5 w-3.5 rounded border-neutral-700 bg-neutral-900 text-blue-600 accent-blue-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="truncate">{option || "(Empty)"}</span>
                </label>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default FilterMenu;

