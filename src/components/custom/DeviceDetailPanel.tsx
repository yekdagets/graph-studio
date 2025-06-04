import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Building2,
  Tag,
  ExternalLink,
  ArrowLeft,
  FileText,
  Clock,
} from "lucide-react";
import type { FDADevice } from "@/types";

interface DeviceDetailPanelProps {
  selectedDevice?: FDADevice | null;
  onClearSelection?: () => void;
}

export default function DeviceDetailPanel({
  selectedDevice,
  onClearSelection,
}: DeviceDetailPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {selectedDevice ? (
        <motion.div
          key="device-detail"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="p-6 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Device Details
            </h3>
            <button
              onClick={onClearSelection}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {selectedDevice.device_name}
              </h4>
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <Tag className="w-4 h-4" />
                <span className="font-mono">{selectedDevice.k_number}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Applicant:
                </span>
                <span className="text-gray-900 dark:text-white font-medium truncate">
                  {selectedDevice.applicant}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Decision:
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {new Date(selectedDevice.decision_date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {selectedDevice.decision_description}
                </span>
              </div>

              {selectedDevice.openfda?.device_class && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Class:
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    Class {selectedDevice.openfda.device_class}
                  </span>
                </div>
              )}
            </div>

            {selectedDevice.predicate_device_numbers &&
              selectedDevice.predicate_device_numbers.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowLeft className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Based on Predicates
                    </span>
                  </div>
                  <div className="space-y-1">
                    {selectedDevice.predicate_device_numbers.map(
                      (predicate, index) => (
                        <div
                          key={index}
                          className="text-xs font-mono text-amber-700 dark:text-amber-300"
                        >
                          {predicate}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Product Code
              </div>
              <div className="text-sm font-mono text-gray-900 dark:text-white">
                {selectedDevice.product_code}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="no-selection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-6 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a device to view details</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
