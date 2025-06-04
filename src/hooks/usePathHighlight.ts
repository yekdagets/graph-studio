import { useState, useCallback, useMemo } from "react";
import type { FDADevice } from "@/types";

interface PathHighlightState {
  selectedNodes: string[];
  highlightedPath: string[];
  pathInfo: {
    startDevice: FDADevice | null;
    endDevice: FDADevice | null;
    pathLength: number;
    relationshipChain: string[];
  } | null;
}

export function usePathHighlight(devices: FDADevice[]) {
  const [pathState, setPathState] = useState<PathHighlightState>({
    selectedNodes: [],
    highlightedPath: [],
    pathInfo: null,
  });

  const adjacencyMap = useMemo(() => {
    const map = new Map<string, string[]>();

    devices.forEach((device) => {
      const kNumber = device.k_number;
      if (!map.has(kNumber)) {
        map.set(kNumber, []);
      }

      if (
        device.predicate_device_numbers &&
        device.predicate_device_numbers.length > 0
      ) {
        const validPredicates = device.predicate_device_numbers.filter(
          (predicateK) => devices.some((d) => d.k_number === predicateK)
        );

        map.get(kNumber)?.push(...validPredicates);

        validPredicates.forEach((predicateK) => {
          if (!map.has(predicateK)) {
            map.set(predicateK, []);
          }
          map.get(predicateK)?.push(kNumber);
        });
      }
    });

    return map;
  }, [devices]);

  const findPath = useCallback(
    (start: string, end: string): string[] => {
      if (start === end) return [start];

      const queue: string[][] = [[start]];
      const visited = new Set<string>([start]);

      while (queue.length > 0) {
        const path = queue.shift()!;
        const current = path[path.length - 1];

        const neighbors = adjacencyMap.get(current) || [];

        for (const neighbor of neighbors) {
          if (neighbor === end) {
            return [...path, neighbor];
          }

          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push([...path, neighbor]);
          }
        }
      }

      return [];
    },
    [adjacencyMap]
  );

  const selectNodeForPath = useCallback(
    (kNumber: string) => {
      setPathState((prev) => {
        const newSelected = [...prev.selectedNodes];

        if (newSelected.includes(kNumber)) {
          const index = newSelected.indexOf(kNumber);
          newSelected.splice(index, 1);
        } else if (newSelected.length < 2) {
          newSelected.push(kNumber);
        } else {
          newSelected[1] = kNumber;
        }

        let highlightedPath: string[] = [];
        let pathInfo = null;

        if (newSelected.length === 2) {
          const [start, end] = newSelected;
          highlightedPath = findPath(start, end);

          const startDevice = devices.find((d) => d.k_number === start) || null;
          const endDevice = devices.find((d) => d.k_number === end) || null;

          pathInfo = {
            startDevice,
            endDevice,
            pathLength: highlightedPath.length,
            relationshipChain: highlightedPath.slice(1, -1),
          };
        }

        return {
          selectedNodes: newSelected,
          highlightedPath,
          pathInfo,
        };
      });
    },
    [findPath, devices]
  );

  const clearPath = useCallback(() => {
    setPathState({
      selectedNodes: [],
      highlightedPath: [],
      pathInfo: null,
    });
  }, []);

  return {
    ...pathState,
    selectNodeForPath,
    clearPath,
    isPathMode: pathState.selectedNodes.length > 0,
  };
}
