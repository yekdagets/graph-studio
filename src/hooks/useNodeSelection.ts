import { useState } from "react";
import type { Node } from "@xyflow/react";
import type { FDADevice, DeviceNodeData } from "@/types";

interface SelectionState {
  selectedNodeId: string | null;
  selectedDevice: FDADevice | null;
  predecessorIds: string[];
  successorIds: string[];
}

export const useNodeSelection = () => {
  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedNodeId: null,
    selectedDevice: null,
    predecessorIds: [],
    successorIds: [],
  });

  const selectNode = (
    nodeId: string,
    device: FDADevice,
    allNodes: Node<DeviceNodeData>[]
  ) => {
    const predecessorIds: string[] = [];
    const successorIds: string[] = [];

    if (device.predicate_device_numbers) {
      predecessorIds.push(...device.predicate_device_numbers);
    }

    allNodes.forEach((node) => {
      if (node.data.device.predicate_device_numbers?.includes(nodeId)) {
        successorIds.push(node.id);
      }
    });

    setSelectionState({
      selectedNodeId: nodeId,
      selectedDevice: device,
      predecessorIds,
      successorIds,
    });
  };

  const clearSelection = () => {
    setSelectionState({
      selectedNodeId: null,
      selectedDevice: null,
      predecessorIds: [],
      successorIds: [],
    });
  };

  return {
    selectionState,
    selectNode,
    clearSelection,
  };
};
