import { motion } from "framer-motion";
import { Search, X, Building2, Filter } from "lucide-react";

interface SearchPanelProps {
  filters: {
    query: string;
    deviceClass: string;
    dateFrom: string;
    dateTo: string;
    applicant: string;
    status: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  deviceOptions: {
    classes: string[];
    applicants: string[];
    statuses: string[];
  };
}

export default function SearchPanel({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  deviceOptions,
}: SearchPanelProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search devices, K-numbers, applicants..."
          value={filters.query}
          onChange={(e) => onFilterChange("query", e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        />
        {filters.query && (
          <button
            onClick={() => onFilterChange("query", "")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={filters.deviceClass}
          onChange={(e) => onFilterChange("deviceClass", e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="">All Classes</option>
          {deviceOptions.classes.map((cls) => (
            <option key={cls} value={cls}>
              Class {cls}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="">All Status</option>
          {deviceOptions.statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange("dateFrom", e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange("dateTo", e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Applicant
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Filter by applicant..."
              value={filters.applicant}
              onChange={(e) => onFilterChange("applicant", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onClearFilters}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </motion.button>
      )}

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"
        >
          <div className="flex items-center gap-1 mb-1">
            <Filter className="w-3 h-3" />
            <span className="font-medium">Active Filters:</span>
          </div>
          <div className="space-y-1">
            {filters.query && <div>• Search: "{filters.query}"</div>}
            {filters.deviceClass && <div>• Class: {filters.deviceClass}</div>}
            {filters.status && <div>• Status: {filters.status}</div>}
            {filters.applicant && <div>• Applicant: "{filters.applicant}"</div>}
            {(filters.dateFrom || filters.dateTo) && (
              <div>
                • Date: {filters.dateFrom || "..."} to {filters.dateTo || "..."}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
