import React from "react";
import { motion } from "framer-motion";
import { EdgeTooltipData } from "@/types";

interface EdgeTooltipProps {
  data: EdgeTooltipData;
  position: { x: number; y: number };
}

const EdgeTooltip: React.FC<EdgeTooltipProps> = ({ data, position }) => {
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Strong":
        return "bg-emerald-400 shadow-emerald-400/50";
      case "Medium":
        return "bg-amber-400 shadow-amber-400/50";
      case "Weak":
        return "bg-slate-400 shadow-slate-400/50";
      default:
        return "bg-blue-400 shadow-blue-400/50";
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Lower Risk":
        return "text-emerald-400";
      case "Same Risk":
        return "text-blue-400";
      case "Higher Risk":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y - 120,
        transform: "translate(-50%, 0)",
        pointerEvents: "none",
        zIndex: 1000,
      }}
      className="
        bg-gradient-to-br from-slate-900 to-slate-800 
        text-white rounded-2xl shadow-2xl 
        border border-slate-700/50 backdrop-blur-sm
        p-4 min-w-[320px] max-w-[380px]
      "
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full shadow-lg ${getStrengthColor(
              data.relationship.strength
            )}`}
          />
          <span className="font-semibold text-white text-sm">
            {data.relationship.type}
          </span>
        </div>
        <span className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded-full border border-slate-600/50">
          {data.confidence}% confidence
        </span>
      </div>

      <p className="text-xs text-slate-300 mb-3 leading-relaxed">
        {data.relationship.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between py-1.5 px-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
          <span className="text-xs text-slate-400 font-medium">Timeline:</span>
          <span className="text-xs font-medium text-white">
            {data.approvalTimeline.description}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 px-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
          <span className="text-xs text-slate-400 font-medium">
            Risk Level:
          </span>
          <span
            className={`text-xs font-medium ${getRiskLevelColor(
              data.riskComparison.riskLevel
            )}`}
          >
            {data.riskComparison.riskLevel}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 px-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
          <span className="text-xs text-slate-400 font-medium">
            Device Classes:
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
              Class {data.riskComparison.sourceClass}
            </span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
              Class {data.riskComparison.targetClass}
            </span>
          </div>
        </div>

        <div className="pt-2 mt-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">
              {new Date(data.approvalTimeline.sourceDate).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-1 text-slate-500">
              <div className="w-8 h-px bg-slate-600" />
              <span className="text-xs bg-slate-700/50 px-2 py-0.5 rounded">
                {data.approvalTimeline.daysDifference}d
              </span>
              <div className="w-8 h-px bg-slate-600"></div>
            </div>
            <span className="text-slate-400 font-mono">
              {new Date(data.approvalTimeline.targetDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EdgeTooltip;
