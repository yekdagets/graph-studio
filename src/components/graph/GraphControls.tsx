import { useReactFlow } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Network,
  Target,
  Route,
} from "lucide-react";
import { useGraphControls } from "@/hooks/useGraphControls";

interface GraphControlsProps {
  selectedNodeId?: string | null;
  relatedNodeIds?: string[];
  onToggleFocusMode?: () => void;
  isFocusMode?: boolean;
  onTogglePathMode?: () => void;
  isPathMode?: boolean;
}

export default function GraphControls({
  selectedNodeId,
  relatedNodeIds = [],
  onToggleFocusMode,
  isFocusMode = false,
  onTogglePathMode,
  isPathMode = false,
}: GraphControlsProps) {
  const { zoomIn, zoomOut } = useReactFlow();
  const { zoomToCluster, resetView, focusNode } = useGraphControls();

  const handleZoomToCluster = () => {
    if (selectedNodeId) {
      zoomToCluster(selectedNodeId, relatedNodeIds);
    }
  };

  const handleFocusSelected = () => {
    if (selectedNodeId) {
      focusNode(selectedNodeId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 right-4 z-10 flex flex-col gap-2"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex flex-col gap-1">
        <button
          onClick={() => zoomIn({ duration: 300 })}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>

        <button
          onClick={() => zoomOut({ duration: 300 })}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>

        <button
          onClick={resetView}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Fit View"
        >
          <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 relative"
      >
        <button
          onClick={onTogglePathMode}
          className={`p-2 rounded-md transition-all duration-200 ${
            isPathMode
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-md"
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
          title={isPathMode ? "Exit Path Analysis Mode" : "Path Analysis Mode"}
        >
          <Route className="w-4 h-4" />
        </button>

        <AnimatePresence>
          {isPathMode && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="absolute right-full mr-3 top-0 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap z-20"
            >
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4" />
                <span>Path Mode Active</span>
              </div>
              <div className="text-xs opacity-90 mt-1 flex items-center gap-1">
                <kbd className="bg-blue-700 px-1 rounded text-xs">Ctrl</kbd>
                <span>+ Click nodes to analyze</span>
              </div>
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-blue-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {selectedNodeId && !isPathMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex flex-col gap-1"
        >
          <button
            onClick={handleFocusSelected}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Focus Selected Node"
          >
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>

          {relatedNodeIds.length > 0 && (
            <button
              onClick={handleZoomToCluster}
              className={`p-2 rounded-md transition-colors ${
                isFocusMode
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
              title="Zoom to Cluster"
            >
              <Network className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}

      {selectedNodeId && relatedNodeIds.length > 0 && !isPathMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3"
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="focus-mode"
              checked={isFocusMode}
              onChange={onToggleFocusMode}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="focus-mode"
              className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Focus Mode
            </label>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isPathMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center max-w-48"
          >
            <div className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
              Path Analysis Mode
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-300">
              Hold{" "}
              <kbd className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                Ctrl
              </kbd>{" "}
              and click two nodes to find their connection path
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
