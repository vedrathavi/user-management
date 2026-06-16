import { useState, useEffect } from "react";
import type { FilterValuesDto } from "../utils/filters";
import { ArrowUp, ArrowDown, ChevronRight, ArrowLeft, Search } from "lucide-react";

interface FilterMenuProps {
  field: string;
  options: string[];
  selectedValues: string[];
  onToggle: (field: string, value: string) => void;
  onSelectAll: (field: string, allValues: string[]) => void;
  onClearAll: (field: string) => void;
  selectedFilters: FilterValuesDto[];
  onOperatorApply: (field: string, operator: string, value: string) => void;
  onOperatorClear: (field: string, operator?: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSort?: (field: string) => void;
  sort?: { field: string; order: "ASC" | "DESC" } | undefined;
}

const operatorLabels: Record<string, string> = {
  equals: "Equals",
  notEquals: "Does Not Equal",
  startsWith: "Begins With",
  endsWith: "Ends With",
  contains: "Contains",
  notContains: "Does Not Contain",
};

const FilterMenu = ({
  field,
  options,
  selectedValues,
  onToggle,
  onSelectAll,
  onClearAll,
  selectedFilters,
  onOperatorApply,
  onOperatorClear,
  isOpen,
  onClose,
  onSort,
  sort,
}: FilterMenuProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuView, setMenuView] = useState<"main" | "textFilters" | "operatorInput" | "dateRange">("main");

  const activeFilters = selectedFilters.filter((f) => f.field === field);
  const activeOperatorFilter = activeFilters.find((f) => f.operator && f.operator !== "gte" && f.operator !== "lte");
  const activeGteFilter = activeFilters.find((f) => f.operator === "gte");
  const activeLteFilter = activeFilters.find((f) => f.operator === "lte");

  const [operatorValue, setOperatorValue] = useState(activeOperatorFilter?.value ?? "");
  const [selectedOperator, setSelectedOperator] = useState(activeOperatorFilter?.operator ?? "contains");

  const [fromDate, setFromDate] = useState(activeGteFilter?.value ?? "");
  const [toDate, setToDate] = useState(activeLteFilter?.value ?? "");

  // Sync state when filters change or menu opens
  useEffect(() => {
    if (isOpen) {
      setOperatorValue(activeOperatorFilter?.value ?? "");
      setSelectedOperator(activeOperatorFilter?.operator ?? "contains");
      setFromDate(activeGteFilter?.value ?? "");
      setToDate(activeLteFilter?.value ?? "");
      setMenuView("main");
      setSearchTerm("");
    }
  }, [isOpen, selectedFilters, field]);

  if (!isOpen) return null;

  // Filter options based on local search term
  const filteredOptions = options.filter((option) =>
    (option || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleApplyOperator = () => {
    onOperatorApply(field, selectedOperator, operatorValue);
    setMenuView("main");
  };

  const handleClearOperator = () => {
    onOperatorClear(field);
    setOperatorValue("");
    setMenuView("main");
  };

  const handleApplyDateRange = () => {
    onOperatorApply(field, "gte", fromDate);
    onOperatorApply(field, "lte", toDate);
    setMenuView("main");
  };

  const handleClearDateRange = () => {
    onOperatorClear(field, "gte");
    onOperatorClear(field, "lte");
    setFromDate("");
    setToDate("");
    setMenuView("main");
  };

  const isCurrentSorted = sort?.field === field;

  // Render helpers
  const renderMainView = () => {
    const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);
    const dateRangeActive = activeGteFilter || activeLteFilter;

    return (
      <div className="flex flex-col gap-3">
        {/* Sorting Section */}
        {onSort && (
          <div className="flex flex-col gap-1 border-b border-neutral-800 pb-2.5">
            <button
              onClick={() => onSort(field)}
              className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:bg-neutral-800 cursor-pointer ${
                isCurrentSorted && sort.order === "ASC"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span>Sort Ascending</span>
              <ArrowUp size={12} />
            </button>
            <button
              onClick={() => onSort(field)}
              className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:bg-neutral-800 cursor-pointer ${
                isCurrentSorted && sort.order === "DESC"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span>Sort Descending</span>
              <ArrowDown size={12} />
            </button>
          </div>
        )}

        {/* Custom Text/Date Filter Trigger */}
        <div className="border-b border-neutral-800 pb-2.5">
          {field === "createdAt" ? (
            <div>
              <button
                onClick={() => setMenuView("dateRange")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:bg-neutral-800 cursor-pointer ${
                  dateRangeActive ? "text-blue-400" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <span>Date Range Filters...</span>
                <ChevronRight size={12} />
              </button>
              {dateRangeActive && (
                <div className="mt-1.5 px-3 text-[10px] text-neutral-400 flex items-center justify-between">
                  <span className="truncate">
                    {fromDate || "*"} to {toDate || "*"}
                  </span>
                  <button
                    onClick={handleClearDateRange}
                    className="text-red-400 hover:text-red-300 font-semibold ml-1 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setMenuView("textFilters")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:bg-neutral-800 cursor-pointer ${
                  activeOperatorFilter ? "text-blue-400" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <span>Text Filters...</span>
                <ChevronRight size={12} />
              </button>
              {activeOperatorFilter && (
                <div className="mt-1.5 px-3 text-[10px] text-neutral-400 flex items-center justify-between">
                  <span className="truncate">
                    {operatorLabels[activeOperatorFilter.operator || ""] || "Filter"}: "{activeOperatorFilter.value}"
                  </span>
                  <button
                    onClick={handleClearOperator}
                    className="text-red-400 hover:text-red-300 font-semibold ml-1 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Input with Search Icon */}
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder={`Search ${fieldLabel === "CreatedAt" ? "Dates" : "options"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 pl-8 pr-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
          />
        </div>

        {/* Select All Option */}
        <div className="border-b border-neutral-800 pb-2">
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
        <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent pr-1 flex flex-col gap-0.5">
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
    );
  };

  const renderTextFiltersList = () => {
    const filterOptionsList = [
      { key: "equals", label: "Equals..." },
      { key: "notEquals", label: "Does Not Equal..." },
      { key: "startsWith", label: "Begins With..." },
      { key: "endsWith", label: "Ends With..." },
      { key: "contains", label: "Contains..." },
      { key: "notContains", label: "Does Not Contain..." },
    ];

    return (
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => setMenuView("main")}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 hover:text-neutral-200 text-left transition-colors duration-150 mb-2 cursor-pointer"
        >
          <ArrowLeft size={12} />
          <span>Back to Menu</span>
        </button>
        <div className="border-t border-neutral-800 pt-1.5 flex flex-col gap-1">
          {filterOptionsList.map((item, idx) => (
            <div key={item.key}>
              <button
                onClick={() => {
                  setSelectedOperator(item.key);
                  setMenuView("operatorInput");
                }}
                className="w-full text-left rounded-lg px-3 py-1.5 text-xs hover:bg-neutral-800/60 text-neutral-300 hover:text-white transition-colors duration-150 cursor-pointer"
              >
                {item.label}
              </button>
              {(idx === 1 || idx === 3) && <div className="border-b border-neutral-800/60 my-1" />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOperatorInputView = () => {
    const opLabel = operatorLabels[selectedOperator] || "Text Filter";
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setMenuView("textFilters")}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 hover:text-neutral-200 text-left transition-colors duration-150 mb-1 cursor-pointer"
        >
          <ArrowLeft size={12} />
          <span>Back to Operators</span>
        </button>
        <div className="border-t border-neutral-800 pt-2 flex flex-col gap-2">
          <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
            {opLabel}
          </span>
          <input
            type="text"
            value={operatorValue}
            onChange={(e) => setOperatorValue(e.target.value)}
            placeholder="Type filter value..."
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 outline-none transition-all duration-200 focus:border-blue-500/50"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApplyOperator();
            }}
          />
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <button
            onClick={handleClearOperator}
            className="rounded-lg px-2.5 py-1.5 text-[10px] font-semibold bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-all duration-150 cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={handleApplyOperator}
            className="rounded-lg px-3 py-1.5 text-[10px] font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all duration-150 cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    );
  };

  const renderDateRangeView = () => {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setMenuView("main")}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 hover:text-neutral-200 text-left transition-colors duration-150 mb-1 cursor-pointer"
        >
          <ArrowLeft size={12} />
          <span>Back to Menu</span>
        </button>
        <div className="border-t border-neutral-800 pt-2 flex flex-col gap-2.5">
          <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
            Date Range Filter
          </span>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-neutral-400 font-medium">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-100 outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-neutral-400 font-medium">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-100 outline-none focus:border-blue-500/50"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <button
            onClick={handleClearDateRange}
            className="rounded-lg px-2.5 py-1.5 text-[10px] font-semibold bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-all duration-150 cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={handleApplyDateRange}
            className="rounded-lg px-3 py-1.5 text-[10px] font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all duration-150 cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop to close the menu when clicking outside */}
      <div className="fixed inset-0 z-40 bg-black/0" onClick={onClose} />

      {/* Menu Container */}
      <div className="absolute top-full right-0 z-50 mt-2 w-64 rounded-xl border border-neutral-800 bg-neutral-950/95 p-4 shadow-2xl backdrop-blur-md text-left normal-case font-normal text-neutral-200">
        {menuView === "main" && renderMainView()}
        {menuView === "textFilters" && renderTextFiltersList()}
        {menuView === "operatorInput" && renderOperatorInputView()}
        {menuView === "dateRange" && renderDateRangeView()}
      </div>
    </>
  );
};

export default FilterMenu;
