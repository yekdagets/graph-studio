import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  Connection,
  ReactFlowProvider,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Route } from "lucide-react";
import { useNodeSelection } from "@/hooks/useNodeSelection";
import { usePathHighlight } from "@/hooks/usePathHighlight";

import DeviceNodeComponent from "@/components/graph/DeviceNodeComponent";
import DeviceEdgeComponent from "@/components/graph/DeviceEdgeComponent";
import GraphControls from "@/components/graph/GraphControls";
import PathInfoPanel from "@/components/custom/PathInfoPanel";

import { mapDevicesToGraphData } from "@/mappers";
import { DeviceNode, DeviceEdge, FDADevice } from "@/types";
import { MOCK_FDA_DEVICES } from "@/utils/data";

interface FlowProps {
  onNodeSelect?: (device: FDADevice | null) => void;
  filteredDevices?: FDADevice[];
}

function FlowContent({
  onNodeSelect,
  filteredDevices = MOCK_FDA_DEVICES,
}: FlowProps) {
  const [allNodes, setAllNodes, onNodesChange] = useNodesState<DeviceNode>([]);
  const [allEdges, setAllEdges, onEdgesChange] = useEdgesState<DeviceEdge>([]);

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isPathMode, setIsPathMode] = useState(false);

  const { selectionState, selectNode, clearSelection } = useNodeSelection();

  const {
    selectedNodes: pathSelectedNodes,
    highlightedPath,
    pathInfo,
    selectNodeForPath,
    clearPath,
    isPathMode: hasPathSelection,
  } = usePathHighlight(filteredDevices);

  const filteredNodes = useMemo(() => {
    const filteredKNumbers = new Set(filteredDevices.map((d) => d.k_number));
    return allNodes.filter((node) => filteredKNumbers.has(node.id));
  }, [allNodes, filteredDevices]);

  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map((node) => node.id));
    return allEdges.filter(
      (edge) =>
        visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
  }, [allEdges, filteredNodes]);

  const visibleNodes = useMemo(() => {
    if (!isFocusMode || !selectionState.selectedNodeId) {
      return filteredNodes;
    }

    const clusterNodeIds = [
      selectionState.selectedNodeId,
      ...selectionState.predecessorIds,
      ...selectionState.successorIds,
    ];

    return filteredNodes.filter((node) => clusterNodeIds.includes(node.id));
  }, [filteredNodes, isFocusMode, selectionState]);

  const visibleEdges = useMemo(() => {
    let baseEdges = filteredEdges;

    if (isFocusMode && selectionState.selectedNodeId) {
      const clusterNodeIds = [
        selectionState.selectedNodeId,
        ...selectionState.predecessorIds,
        ...selectionState.successorIds,
      ];

      baseEdges = filteredEdges.filter(
        (edge) =>
          clusterNodeIds.includes(edge.source) &&
          clusterNodeIds.includes(edge.target)
      );
    }

    return baseEdges.map((edge) => {
      const isInPath =
        highlightedPath.length > 1 &&
        highlightedPath.some(
          (nodeId, index) =>
            index < highlightedPath.length - 1 &&
            ((edge.source === nodeId &&
              edge.target === highlightedPath[index + 1]) ||
              (edge.target === nodeId &&
                edge.source === highlightedPath[index + 1]))
        );

      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: isInPath ? "#3b82f6" : edge.style?.stroke || "#6366f1",
          strokeWidth: isInPath ? 4 : edge.style?.strokeWidth || 2,
          opacity: isPathMode ? (isInPath ? 1 : 0.3) : 1,
        },
        animated: isInPath || edge.animated,
      };
    });
  }, [filteredEdges, isFocusMode, selectionState, highlightedPath, isPathMode]);

  const nodeTypes = useMemo(
    () => ({
      deviceNode: (props: any) => (
        <DeviceNodeComponent
          {...props}
          isSelected={props.id === selectionState.selectedNodeId}
          isPredecessor={selectionState.predecessorIds.includes(props.id)}
          isSuccessor={selectionState.successorIds.includes(props.id)}
          isPathSelected={pathSelectedNodes.includes(props.id)}
          isInPath={highlightedPath.includes(props.id)}
          isPathMode={isPathMode}
          onNodeClick={(
            nodeId: string,
            device: FDADevice,
            event?: React.MouseEvent
          ) => {
            if (isPathMode && event && (event.ctrlKey || event.metaKey)) {
              selectNodeForPath(nodeId);
            } else if (isPathMode) {
              return;
            } else {
              selectNode(nodeId, device, allNodes);
              onNodeSelect?.(device);
              if (hasPathSelection) clearPath();
            }
          }}
        />
      ),
    }),
    [
      selectionState,
      allNodes,
      selectNode,
      onNodeSelect,
      pathSelectedNodes,
      highlightedPath,
      isPathMode,
      selectNodeForPath,
      clearPath,
      hasPathSelection,
    ]
  );

  const edgeTypes = useMemo(
    () => ({
      deviceEdge: DeviceEdgeComponent,
    }),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setAllEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [setAllEdges]
  );

  const onPaneClick = useCallback(() => {
    if (!isPathMode) {
      clearSelection();
      onNodeSelect?.(null);
      setIsFocusMode(false);
    }
    if (hasPathSelection) clearPath();
  }, [clearSelection, onNodeSelect, isPathMode, hasPathSelection, clearPath]);

  const handleToggleFocusMode = useCallback(() => {
    setIsFocusMode((prev) => !prev);
  }, []);

  const handleTogglePathMode = useCallback(() => {
    setIsPathMode((prev) => {
      if (prev) {
        clearPath();
      }
      return !prev;
    });
  }, [clearPath]);

  useEffect(() => {
    if (selectionState.selectedNodeId && filteredDevices.length > 0) {
      const selectedDeviceExists = filteredDevices.some(
        (device) => device.k_number === selectionState.selectedNodeId
      );

      if (!selectedDeviceExists) {
        clearSelection();
        onNodeSelect?.(null);
        setIsFocusMode(false);
      }
    }
  }, [
    filteredDevices,
    selectionState.selectedNodeId,
    clearSelection,
    onNodeSelect,
  ]);

  useEffect(() => {
    const graphData = mapDevicesToGraphData(MOCK_FDA_DEVICES);
    setAllNodes(graphData.nodes);
    setAllEdges(graphData.edges);
  }, [setAllNodes, setAllEdges]);

  const relatedNodeIds = [
    ...selectionState.predecessorIds,
    ...selectionState.successorIds,
  ];

  return (
    <div className="w-full h-full relative">
      <ReactFlow<DeviceNode, DeviceEdge>
        nodes={visibleNodes}
        edges={visibleEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          animated: true,
          type: "deviceEdge",
          style: { strokeWidth: 2, stroke: "#6366f1" },
        }}
        className="bg-gray-50 dark:bg-gray-900"
        fitView
      >
        <MiniMap nodeColor="#6366f1" position="bottom-right" />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>

      <GraphControls
        selectedNodeId={selectionState.selectedNodeId}
        relatedNodeIds={relatedNodeIds}
        onToggleFocusMode={handleToggleFocusMode}
        isFocusMode={isFocusMode}
        onTogglePathMode={handleTogglePathMode}
        isPathMode={isPathMode}
      />

      <AnimatePresence>
        {hasPathSelection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-4 left-4 z-10"
          >
            <PathInfoPanel
              pathInfo={pathInfo}
              selectedNodes={pathSelectedNodes}
              onClearPath={clearPath}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPathMode && pathSelectedNodes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl text-center max-w-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Route className="w-5 h-5" />
                <span className="font-semibold">Path Analysis Mode</span>
              </div>
              <p className="text-sm opacity-90 mb-3">
                Hold{" "}
                <kbd className="bg-blue-700 px-2 py-1 rounded text-xs">
                  Ctrl
                </kbd>{" "}
                + Click on two nodes to find the connection path between them
              </p>
              <div className="text-xs opacity-75">
                Click the path button again to exit
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredDevices.length < MOCK_FDA_DEVICES.slice(0, 4).length &&
        !isFocusMode &&
        !isPathMode && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 text-sm">
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                Showing {visibleNodes.length} of 4 devices
              </span>
            </div>
          </div>
        )}

      {isFocusMode && !isPathMode && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 text-sm">
            <span className="text-green-800 dark:text-green-200 font-medium">
              Focus Mode: Showing cluster only
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Flow(props: FlowProps) {
  return (
    <ReactFlowProvider>
      <FlowContent {...props} />
    </ReactFlowProvider>
  );
}
