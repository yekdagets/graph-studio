import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Image,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { FDADevice } from "@/types";
import { useExport } from "@/hooks/useExport";

interface ExportPanelProps {
  devices: FDADevice[];
  filteredDevices: FDADevice[];
  selectedDevice?: FDADevice | null;
}

export default function ExportPanel({
  devices,
  filteredDevices,
  selectedDevice,
}: ExportPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    type: string;
    status: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "", status: "idle" });

  const { exportAsJSON, exportAsCSV, exportGraphAsPNG, exportStatsAsJSON } =
    useExport();

  const handleExport = async (
    type: string,
    exportFn: () => void | Promise<void>
  ) => {
    setExportStatus({ type, status: "loading" });

    try {
      await exportFn();
      setExportStatus({
        type,
        status: "success",
        message: "Export completed successfully!",
      });

      setTimeout(() => {
        setExportStatus({ type: "", status: "idle" });
      }, 3000);
    } catch (error) {
      setExportStatus({
        type,
        status: "error",
        message: "Export failed. Please try again.",
      });

      setTimeout(() => {
        setExportStatus({ type: "", status: "idle" });
      }, 3000);
    }
  };

  const exportOptions = [
    {
      id: "json-all",
      label: "All Data (JSON)",
      description: `Export all ${devices.length} devices with metadata`,
      icon: FileText,
      action: () => exportAsJSON(devices, "fda-all-devices"),
    },
    {
      id: "json-filtered",
      label: "Filtered Data (JSON)",
      description: `Export ${filteredDevices.length} filtered devices`,
      icon: FileText,
      action: () => exportAsJSON(filteredDevices, "fda-filtered-devices"),
      disabled: filteredDevices.length === 0,
    },
    {
      id: "csv-all",
      label: "All Data (CSV)",
      description: `Export all ${devices.length} devices as spreadsheet`,
      icon: FileText,
      action: () => exportAsCSV(devices, "fda-all-devices"),
    },
    {
      id: "csv-filtered",
      label: "Filtered Data (CSV)",
      description: `Export ${filteredDevices.length} filtered devices as spreadsheet`,
      icon: FileText,
      action: () => exportAsCSV(filteredDevices, "fda-filtered-devices"),
      disabled: filteredDevices.length === 0,
    },
    {
      id: "graph-png",
      label: "Graph Screenshot",
      description: "Export current graph view as PNG image",
      icon: Image,
      action: () => exportGraphAsPNG("fda-graph-visualization"),
    },
    {
      id: "stats-json",
      label: "Statistics Report",
      description: "Export analysis and statistics as JSON",
      icon: BarChart3,
      action: () => exportStatsAsJSON(filteredDevices, "fda-statistics-report"),
    },
  ];

  const getStatusIcon = (optionId: string) => {
    if (exportStatus.type !== optionId) return null;

    switch (exportStatus.status) {
      case "loading":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="border-t border-gray-200 dark:border-gray-700"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            Export & Analysis
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 pb-6 space-y-3"
          >
            {exportOptions.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  !option.disabled && handleExport(option.id, option.action)
                }
                disabled={option.disabled || exportStatus.status === "loading"}
                className={`
                  w-full p-3 rounded-lg border text-left transition-all duration-200
                  ${
                    option.disabled
                      ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <option.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </div>
                  {getStatusIcon(option.id)}
                </div>
              </motion.button>
            ))}

            <AnimatePresence>
              {exportStatus.status !== "idle" && exportStatus.message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`
                    p-3 rounded-lg text-sm
                    ${
                      exportStatus.status === "success"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                    }
                  `}
                >
                  {exportStatus.message}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Stats
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Total:
                  </span>
                  <span className="ml-1 font-semibold text-gray-900 dark:text-white">
                    {devices.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Visible:
                  </span>
                  <span className="ml-1 font-semibold text-blue-600 dark:text-blue-400">
                    {filteredDevices.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Selected:
                  </span>
                  <span className="ml-1 font-semibold text-green-600 dark:text-green-400">
                    {selectedDevice ? "1" : "0"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Connections:
                  </span>
                  <span className="ml-1 font-semibold text-purple-600 dark:text-purple-400">
                    {devices.reduce(
                      (acc, d) =>
                        acc + (d.predicate_device_numbers?.length || 0),
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
