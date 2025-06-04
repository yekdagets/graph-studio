import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, ChevronDown, ChevronRight } from "lucide-react";
import type { FDADevice } from "@/types";
import { MOCK_FDA_DEVICES } from "@/utils/data";

interface StatisticsPanelProps {
  selectedDevice?: FDADevice | null;
  filteredDevices: FDADevice[];
  hasActiveFilters: boolean;
}

export default function StatisticsPanel({
  selectedDevice,
  filteredDevices,
  hasActiveFilters,
}: StatisticsPanelProps) {
  const [isStatsOpen, setIsStatsOpen] = useState(true);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="border-b border-gray-200 dark:border-gray-700"
    >
      <button
        onClick={() => setIsStatsOpen(!isStatsOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            Graph Statistics
          </span>
        </div>
        {isStatsOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {isStatsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 pb-6 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Devices
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {MOCK_FDA_DEVICES.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Visible
              </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {filteredDevices.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Selected
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {selectedDevice ? "1" : "0"}
              </span>
            </div>
            {hasActiveFilters && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Filtered
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {MOCK_FDA_DEVICES.length - filteredDevices.length}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
