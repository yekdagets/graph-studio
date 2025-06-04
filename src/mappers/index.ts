import { FDADevice, DeviceNode, DeviceEdge, GraphData } from "@/types";

export const mapDeviceToNode = (
  device: FDADevice,
  position?: { x: number; y: number }
): DeviceNode => {
  return {
    id: device.k_number,
    type: "deviceNode",
    position: position || { x: 0, y: 0 },
    data: {
      label: device.device_name || device.k_number,
      device,
      isSelected: false,
    },
  };
};

export const mapPredicatesToEdges = (
  device: FDADevice,
  allDevices: FDADevice[]
): DeviceEdge[] => {
  const edges: DeviceEdge[] = [];

  if (
    device.predicate_device_numbers &&
    device.predicate_device_numbers.length > 0
  ) {
    const allDeviceIds = new Set(allDevices.map((d) => d.k_number));

    device.predicate_device_numbers.forEach((predicateKNumber, index) => {
      if (allDeviceIds.has(predicateKNumber)) {
        edges.push({
          id: `${device.k_number}-${predicateKNumber}-${index}`,
          source: predicateKNumber,
          target: device.k_number,
          type: "deviceEdge",
          animated: true,
          style: { strokeWidth: 2, stroke: "#6366f1" },
        });
      }
    });
  }

  return edges;
};

export const mapDevicesToGraphData = (devices: FDADevice[]): GraphData => {
  const nodes: DeviceNode[] = devices.map((device, index) => ({
    id: device.k_number,
    type: "deviceNode",
    position: { x: index * 350, y: 100 },
    data: {
      device,
      label: device.device_name,
    },
  }));

  const edges: DeviceEdge[] = [];
  devices.forEach((device) => {
    const deviceEdges = mapPredicatesToEdges(device, devices);
    edges.push(...deviceEdges);
  });

  return { nodes, edges };
};

export const calculateNodePositions = (
  devices: FDADevice[]
): Map<string, { x: number; y: number }> => {
  const positions = new Map<string, { x: number; y: number }>();

  const centerX = 400;
  const centerY = 300;
  const radius = 200;

  devices.forEach((device, index) => {
    const angle = (index / devices.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    positions.set(device.k_number, { x, y });
  });

  return positions;
};

export const mapDevicesToGraphDataWithLayout = (
  devices: FDADevice[]
): GraphData => {
  const positions = calculateNodePositions(devices);
  const nodes: DeviceNode[] = [];
  const edges: DeviceEdge[] = [];

  devices.forEach((device) => {
    const position = positions.get(device.k_number) || { x: 0, y: 0 };
    const node = mapDeviceToNode(device, position);
    nodes.push(node);
  });

  devices.forEach((device) => {
    const deviceEdges = mapPredicatesToEdges(device, devices);
    edges.push(...deviceEdges);
  });

  return {
    nodes,
    edges,
  };
};

export const findRootDevices = (devices: FDADevice[]): FDADevice[] => {
  return devices.filter(
    (device) =>
      !device.predicate_device_numbers ||
      device.predicate_device_numbers.length === 0
  );
};

export const findLeafDevices = (devices: FDADevice[]): FDADevice[] => {
  const allPredicates = new Set<string>();

  devices.forEach((device) => {
    if (device.predicate_device_numbers) {
      device.predicate_device_numbers.forEach((predicate) => {
        allPredicates.add(predicate);
      });
    }
  });

  return devices.filter((device) => !allPredicates.has(device.k_number));
};
