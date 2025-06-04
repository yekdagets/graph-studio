import { Handle, Position, NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";
import {
  Calendar,
  Building2,
  Tag,
  ExternalLink,
  Zap,
  Target,
  Route,
} from "lucide-react";
import { DeviceNode } from "@/types";

interface DeviceNodeComponentProps extends NodeProps<DeviceNode> {
  isSelected?: boolean;
  isPredecessor?: boolean;
  isSuccessor?: boolean;
  isPathSelected?: boolean;
  isInPath?: boolean;
  isPathMode?: boolean;
  onNodeClick?: (nodeId: string, device: any, event?: React.MouseEvent) => void;
}

export default function DeviceNodeComponent({
  data,
  selected,
  isSelected = false,
  isPredecessor = false,
  isSuccessor = false,
  isPathSelected = false,
  isInPath = false,
  isPathMode = false,
  onNodeClick,
  id,
}: DeviceNodeComponentProps) {
  const device = data.device;

  const handleClick = (event: React.MouseEvent) => {
    if (isPathMode && !(event.ctrlKey || event.metaKey)) {
      const node = event.currentTarget;
      node.classList.add("animate-pulse");
      setTimeout(() => {
        node.classList.remove("animate-pulse");
      }, 1000);
      return;
    }

    if (onNodeClick) {
      onNodeClick(id, device, event);
    }
  };

  const getNodeStyle = () => {
    if (isPathSelected) {
      return "border-blue-500 shadow-blue-500/30 shadow-xl ring-4 ring-blue-500/20 bg-blue-50 dark:bg-blue-900/20";
    }
    if (isInPath) {
      return "border-blue-300 shadow-blue-300/20 shadow-lg ring-2 ring-blue-300/10 bg-blue-25 dark:bg-blue-900/10";
    }
    if (isSelected) {
      return "border-green-500 shadow-green-500/20 shadow-xl ring-4 ring-green-500/10";
    }
    if (isPredecessor) {
      return "border-amber-400 shadow-amber-400/20 shadow-lg ring-2 ring-amber-400/10";
    }
    if (isSuccessor) {
      return "border-blue-500 shadow-blue-500/20 shadow-lg ring-2 ring-blue-500/10";
    }
    if (selected) {
      return "border-blue-500 shadow-blue-500/20 shadow-xl";
    }
    if (isPathMode) {
      return "border-gray-200 dark:border-gray-600 opacity-60 hover:opacity-100";
    }
    return "border-gray-200 dark:border-gray-600 hover:border-gray-300";
  };

  const handleColor = isPathSelected
    ? "#3b82f6"
    : isSelected
    ? "#10b981"
    : isPredecessor
    ? "#f59e0b"
    : isSuccessor
    ? "#3b82f6"
    : "#3b82f6";

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: handleColor,
          border: "2px solid white",
          width: "12px",
          height: "12px",
          left: "-6px",
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: handleColor,
          border: "2px solid white",
          width: "12px",
          height: "12px",
          right: "-6px",
        }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: isSelected
            ? 1.05
            : isPredecessor || isSuccessor || isPathSelected || isInPath
            ? 1.02
            : 1,
          opacity: isPathMode && !isPathSelected && !isInPath ? 0.6 : 1,
        }}
        whileHover={{
          scale: isSelected ? 1.07 : 1.02,
          opacity: 1,
        }}
        transition={{ duration: 0.2 }}
        onClick={handleClick}
        className={`
          bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-200 cursor-pointer
          ${getNodeStyle()}
          min-w-[280px] max-w-[320px]
        `}
      >
        {isPathSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Target className="w-3 h-3 text-white" />
          </motion.div>
        )}

        {isInPath && !isPathSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full shadow-md flex items-center justify-center"
          >
            <Route className="w-2 h-2 text-white" />
          </motion.div>
        )}

        {isSelected && !isPathSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Zap className="w-3 h-3 text-white" />
          </motion.div>
        )}

        {isPredecessor && !isSelected && !isPathSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full shadow-md flex items-center justify-center"
          >
            <span className="text-white text-xs">↑</span>
          </motion.div>
        )}

        {isSuccessor && !isSelected && !isPathSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full shadow-md flex items-center justify-center"
          >
            <span className="text-white text-xs">↓</span>
          </motion.div>
        )}

        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1">
                {device.device_name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-mono">
                <Tag className="w-3 h-3" />
                {device.k_number}
              </div>
            </div>
            <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors nodrag">
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Building2 className="w-3 h-3" />
            <span className="truncate">{device.applicant}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{new Date(device.decision_date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {device.decision_description}
            </span>

            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              Class {device.openfda?.device_class || "N/A"}
            </span>
          </div>
        </div>

        {isPathMode && !isPathSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none"
          >
            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg flex items-center gap-1">
              <kbd className="bg-blue-700 px-1 rounded text-xs">Ctrl</kbd>
              <span>+ Click</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
