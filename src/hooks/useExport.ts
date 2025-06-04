import { useCallback } from "react";
import { toPng } from "html-to-image";
import type { FDADevice } from "@/types";

interface ExportStats {
  totalDevices: number;
  deviceClasses: Record<string, number>;
  applicants: Record<string, number>;
  statuses: Record<string, number>;
  dateRange: {
    earliest: string;
    latest: string;
  };
  connections: number;
}

export function useExport() {
  const generateStats = useCallback((devices: FDADevice[]): ExportStats => {
    const deviceClasses: Record<string, number> = {};
    const applicants: Record<string, number> = {};
    const statuses: Record<string, number> = {};
    const dates: string[] = [];
    let connections = 0;

    devices.forEach((device) => {
      const deviceClass = device.openfda?.device_class || "Unknown";
      deviceClasses[deviceClass] = (deviceClasses[deviceClass] || 0) + 1;

      applicants[device.applicant] = (applicants[device.applicant] || 0) + 1;

      statuses[device.decision_description] =
        (statuses[device.decision_description] || 0) + 1;

      dates.push(device.decision_date);

      if (device.predicate_device_numbers) {
        connections += device.predicate_device_numbers.length;
      }
    });

    const sortedDates = dates.sort();

    return {
      totalDevices: devices.length,
      deviceClasses,
      applicants,
      statuses,
      dateRange: {
        earliest: sortedDates[0] || "",
        latest: sortedDates[sortedDates.length - 1] || "",
      },
      connections,
    };
  }, []);

  const exportAsJSON = useCallback(
    (devices: FDADevice[], filename = "fda-devices") => {
      const stats = generateStats(devices);
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: "1.0",
          source: "FDA 510(k) Explorer",
        },
        statistics: stats,
        devices,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [generateStats]
  );

  const exportAsCSV = useCallback(
    (devices: FDADevice[], filename = "fda-devices") => {
      const headers = [
        "K Number",
        "Device Name",
        "Applicant",
        "Date Received",
        "Decision Date",
        "Decision Description",
        "Product Code",
        "Device Class",
        "Predicate Devices",
      ];

      const rows = devices.map((device) => [
        device.k_number,
        `"${device.device_name.replace(/"/g, '""')}"`,
        `"${device.applicant.replace(/"/g, '""')}"`,
        device.date_received,
        device.decision_date,
        device.decision_description,
        device.product_code,
        device.openfda?.device_class || "N/A",
        device.predicate_device_numbers?.join("; ") || "None",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    []
  );

  const exportGraphAsPNG = useCallback(async (filename = "fda-graph") => {
    const graphElement = document.querySelector(".react-flow") as HTMLElement;
    if (!graphElement) {
      throw new Error("Graph element not found");
    }

    try {
      const dataUrl = await toPng(graphElement, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export graph:", error);
      throw error;
    }
  }, []);

  const exportStatsAsJSON = useCallback(
    (devices: FDADevice[], filename = "fda-statistics") => {
      const stats = generateStats(devices);
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: "1.0",
          source: "FDA 510(k) Explorer - Statistics",
        },
        ...stats,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [generateStats]
  );

  return {
    exportAsJSON,
    exportAsCSV,
    exportGraphAsPNG,
    exportStatsAsJSON,
    generateStats,
  };
}
