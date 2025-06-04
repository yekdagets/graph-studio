import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearch } from "@/hooks/useSearch";

import Header from "@/components/layout/Header";
import DeviceDetailsPanel from "@/components/custom/DeviceDetailPanel";
import SearchPanel from "@/components/custom/SearchPanel";
import StatisticsPanel from "@/components/custom/StatisticsPanel";
import ActionsPanel from "@/components/custom/ActionsPanel";
import ExportPanel from "@/components/custom/ExportPanel";

import type { FDADevice } from "@/types";
import { MOCK_FDA_DEVICES } from "@/utils/data";
interface SidebarProps {
  selectedDevice?: FDADevice | null;
  onClearSelection?: () => void;
  onFilteredDevicesChange?: (devices: FDADevice[]) => void;
}

export default function Sidebar({
  selectedDevice,
  onClearSelection,
  onFilteredDevicesChange,
}: SidebarProps) {
  const {
    filters,
    filteredDevices,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  } = useSearch(MOCK_FDA_DEVICES);

  const deviceOptions = useMemo(() => {
    const classes = [
      ...new Set(
        MOCK_FDA_DEVICES.map((d) => d.openfda?.device_class).filter(Boolean)
      ),
    ].filter((cls): cls is string => cls !== undefined);

    const applicants = [...new Set(MOCK_FDA_DEVICES.map((d) => d.applicant))];
    const statuses = [
      ...new Set(MOCK_FDA_DEVICES.map((d) => d.decision_description)),
    ];

    return { classes, applicants, statuses };
  }, []);

  useEffect(() => {
    onFilteredDevicesChange?.(filteredDevices);
  }, [filteredDevices, onFilteredDevicesChange]);

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full"
    >
      <Header />

      <div className="flex-1 overflow-y-auto">
        <DeviceDetailsPanel
          selectedDevice={selectedDevice}
          onClearSelection={onClearSelection}
        />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 border-b border-gray-200 dark:border-gray-700"
        >
          <SearchPanel
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            deviceOptions={deviceOptions}
          />
        </motion.div>

        <StatisticsPanel
          selectedDevice={selectedDevice}
          filteredDevices={filteredDevices}
          hasActiveFilters={hasActiveFilters}
        />
        <ExportPanel
          devices={MOCK_FDA_DEVICES}
          filteredDevices={filteredDevices}
          selectedDevice={selectedDevice}
        />
      </div>

      <ActionsPanel />
    </motion.div>
  );
}
