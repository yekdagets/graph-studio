import { FDADevice } from "@/types";

const connectionStatusCache = new Map<string, any>();

// for feature improvements->i tried to implement missing predicates UX
export const getDeviceConnectionStatus = (
  device: FDADevice,
  allDevices: FDADevice[]
) => {
  const cacheKey = `${device.k_number}-${allDevices.length}`;

  if (connectionStatusCache.has(cacheKey)) {
    return connectionStatusCache.get(cacheKey);
  }

  const missingPredicates = findMissingPredicates(device, allDevices);
  const hasValidPredicates =
    device.predicate_device_numbers?.some((predicateId) =>
      allDevices.some((d) => d.k_number === predicateId)
    ) || false;

  const result = {
    missingPredicates,
    hasValidPredicates,
    isIsolated: !hasValidPredicates && missingPredicates.length === 0,
    hasIssues: missingPredicates.length > 0,
  };

  connectionStatusCache.set(cacheKey, result);

  return result;
};

export const findMissingPredicates = (
  device: FDADevice,
  allDevices: FDADevice[]
): string[] => {
  if (
    !device.predicate_device_numbers ||
    device.predicate_device_numbers.length === 0
  ) {
    return [];
  }

  const allDeviceIds = new Set(allDevices.map((d) => d.k_number));

  return device.predicate_device_numbers.filter(
    (predicateId) => !allDeviceIds.has(predicateId)
  );
};
