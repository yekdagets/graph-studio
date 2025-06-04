import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Sidebar from "@/components/layout/Sidebar";
import Flow from "@/components/graph/Flow";
import type { FDADevice } from "@/types";

function App() {
  const [selectedDevice, setSelectedDevice] = useState<FDADevice | null>(null);
  const [filteredDevices, setFilteredDevices] = useState<FDADevice[]>([]);

  const handleNodeSelect = (device: FDADevice | null) => {
    setSelectedDevice(device);
  };

  const handleClearSelection = () => {
    setSelectedDevice(null);
  };

  const handleFilteredDevicesChange = (devices: FDADevice[]) => {
    setFilteredDevices(devices);
  };

  return (
    <AppLayout
      sidebar={
        <Sidebar
          selectedDevice={selectedDevice}
          onClearSelection={handleClearSelection}
          onFilteredDevicesChange={handleFilteredDevicesChange}
        />
      }
      main={
        <Flow
          onNodeSelect={handleNodeSelect}
          filteredDevices={filteredDevices}
        />
      }
    />
  );
}

export default App;
