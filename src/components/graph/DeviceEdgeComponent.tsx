import { useState } from "react";
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  useReactFlow,
} from "@xyflow/react";
import { AnimatePresence } from "framer-motion";
import EdgeTooltip from "@/components/graph/EdgeTooltip";
import { DeviceEdge, EdgeTooltipData, DeviceNode } from "@/types";
import {
  detectRelationshipType,
  calculateApprovalTimeline,
  calculateRiskComparison,
} from "@/utils/relationshipEngine";

export default function DeviceEdgeComponent({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  source,
  target,
}: EdgeProps<DeviceEdge>) {
  const [isHovered, setIsHovered] = useState(false);
  const { getNode } = useReactFlow<DeviceNode>();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const sourceNode = getNode(source);
  const targetNode = getNode(target);

  const tooltipData: EdgeTooltipData | null =
    sourceNode?.data?.device && targetNode?.data?.device
      ? {
          relationship: detectRelationshipType(
            sourceNode.data.device,
            targetNode.data.device
          ),
          approvalTimeline: calculateApprovalTimeline(
            sourceNode.data.device,
            targetNode.data.device
          ),
          riskComparison: calculateRiskComparison(
            sourceNode.data.device,
            targetNode.data.device
          ),
          confidence: 85,
        }
      : null;

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          ...style,
          strokeWidth: isHovered ? 3 : 2,
          stroke: isHovered ? "#6366f1" : "#94a3b8",
          transition: "all 0.2s ease",
        }}
      />

      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: "pointer" }}
      />

      <EdgeLabelRenderer>
        <AnimatePresence>
          {isHovered && tooltipData && (
            <EdgeTooltip
              data={tooltipData}
              position={{ x: labelX, y: labelY }}
            />
          )}
        </AnimatePresence>
      </EdgeLabelRenderer>
    </>
  );
}
