import { useQuery } from "@tanstack/react-query";
import { fdaService } from "@/services";
import { SearchParams } from "@/types";

export const useFDADevices = (searchParams: SearchParams) => {
  return useQuery({
    queryKey: ["fda-devices", searchParams],
    queryFn: async () => {
      const response = await fdaService.searchDevices(searchParams);
      return response.results || [];
    },
    enabled: !!searchParams.query || !!searchParams.kNumber,
  });
};

export const useFDADevice = (kNumber: string) => {
  return useQuery({
    queryKey: ["fda-device", kNumber],
    queryFn: () => fdaService.getDeviceByKNumber(kNumber),
    enabled: !!kNumber,
  });
};
