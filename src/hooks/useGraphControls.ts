import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

export const useGraphControls = () => {
  const { fitView, getNodes, setCenter, setViewport } = useReactFlow();

  const zoomToCluster = useCallback(
    (
      selectedNodeId: string,
      relatedNodeIds: string[],
      duration: number = 800
    ) => {
      const allNodes = getNodes();
      const clusterNodeIds = [selectedNodeId, ...relatedNodeIds];
      const clusterNodes = allNodes.filter((node) =>
        clusterNodeIds.includes(node.id)
      );

      if (clusterNodes.length === 0) return;

      const minX = Math.min(...clusterNodes.map((node) => node.position.x));
      const maxX = Math.max(
        ...clusterNodes.map((node) => node.position.x + (node.width || 320))
      );
      const minY = Math.min(...clusterNodes.map((node) => node.position.y));
      const maxY = Math.max(
        ...clusterNodes.map((node) => node.position.y + (node.height || 200))
      );

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const width = maxX - minX + 100; 
      const height = maxY - minY + 100; 

      const viewportWidth = window.innerWidth - 320; 
      const viewportHeight = window.innerHeight;
      const zoomX = viewportWidth / width;
      const zoomY = viewportHeight / height;
      const zoom = Math.min(zoomX, zoomY, 1.5); 

      setViewport(
        {
          x: -centerX * zoom + viewportWidth / 2,
          y: -centerY * zoom + viewportHeight / 2,
          zoom,
        },
        { duration }
      );
    },
    [setViewport, getNodes]
  );

  const resetView = useCallback(() => {
    fitView({ duration: 800, padding: 0.1 });
  }, [fitView]);

  const focusNode = useCallback(
    (nodeId: string, duration: number = 600) => {
      const allNodes = getNodes();
      const targetNode = allNodes.find((node) => node.id === nodeId);

      if (!targetNode) return;

      const centerX = targetNode.position.x + (targetNode.width || 320) / 2;
      const centerY = targetNode.position.y + (targetNode.height || 200) / 2;

      setCenter(centerX, centerY, { zoom: 1.8, duration });
    },
    [setCenter, getNodes]
  );

  return {
    zoomToCluster,
    resetView,
    focusNode,
  };
};
