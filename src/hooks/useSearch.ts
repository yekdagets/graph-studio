import { useState, useMemo, useCallback } from "react";
import type { FDADevice } from "@/types";

interface SearchFilters {
  query: string;
  deviceClass: string;
  dateFrom: string;
  dateTo: string;
  applicant: string;
  status: string;
}

export const useSearch = (devices: FDADevice[]) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    deviceClass: "",
    dateFrom: "",
    dateTo: "",
    applicant: "",
    status: "",
  });

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const searchableText = [
          device.device_name,
          device.k_number,
          device.applicant,
          device.product_code,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      if (
        filters.deviceClass &&
        device.openfda?.device_class !== filters.deviceClass
      ) {
        return false;
      }

      if (filters.dateFrom) {
        const deviceDate = new Date(device.decision_date);
        const fromDate = new Date(filters.dateFrom);
        if (deviceDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo) {
        const deviceDate = new Date(device.decision_date);
        const toDate = new Date(filters.dateTo);
        if (deviceDate > toDate) {
          return false;
        }
      }

      if (
        filters.applicant &&
        !device.applicant
          .toLowerCase()
          .includes(filters.applicant.toLowerCase())
      ) {
        return false;
      }

      if (filters.status && device.decision_description !== filters.status) {
        return false;
      }

      return true;
    });
  }, [devices, filters]);

  const updateFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = () => {
    setFilters({
      query: "",
      deviceClass: "",
      dateFrom: "",
      dateTo: "",
      applicant: "",
      status: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return {
    filters,
    filteredDevices,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
};
