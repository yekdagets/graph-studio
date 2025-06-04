import { motion, AnimatePresence } from "framer-motion";
import { Route, X, ArrowRight } from "lucide-react";
import type { FDADevice } from "@/types";

interface PathInfoPanelProps {
  pathInfo: {
    startDevice: FDADevice | null;
    endDevice: FDADevice | null;
    pathLength: number;
    relationshipChain: string[];
  } | null;
  selectedNodes: string[];
  onClearPath: () => void;
}

export default function PathInfoPanel({
  pathInfo,
  selectedNodes,
  onClearPath,
}: PathInfoPanelProps) {
  if (selectedNodes.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-blue-900 dark:text-blue-100">
            Path Analysis
          </span>
        </div>
        <button
          onClick={onClearPath}
          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
        >
          <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </button>
      </div>

      {selectedNodes.length === 1 && (
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Select a second node to find the connection path
        </p>
      )}

      <AnimatePresence>
        {pathInfo && selectedNodes.length === 2 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-blue-900 dark:text-blue-100">
                {pathInfo.startDevice?.device_name || selectedNodes[0]}
              </span>
              <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                {pathInfo.endDevice?.device_name || selectedNodes[1]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-blue-600 dark:text-blue-400">
                  Path Length:
                </span>
                <div className="font-semibold text-blue-900 dark:text-blue-100">
                  {pathInfo.pathLength > 0
                    ? `${pathInfo.pathLength} nodes`
                    : "No connection"}
                </div>
              </div>
              <div>
                <span className="text-blue-600 dark:text-blue-400">
                  Relationship:
                </span>
                <div className="font-semibold text-blue-900 dark:text-blue-100">
                  {pathInfo.pathLength > 0 ? "Connected" : "Isolated"}
                </div>
              </div>
            </div>

            {pathInfo.relationshipChain.length > 0 && (
              <div>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Via:
                </span>
                <div className="text-xs font-mono text-blue-800 dark:text-blue-200 mt-1">
                  {pathInfo.relationshipChain.join(" → ")}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
