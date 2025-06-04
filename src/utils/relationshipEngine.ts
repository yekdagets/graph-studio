import { FDADevice, RelationshipStrength, RelationshipType } from "@/types";

export const detectRelationshipType = (
  sourceDevice: FDADevice,
  targetDevice: FDADevice
): RelationshipType => {
  let baseType = "Predicate";
  let strength = RelationshipStrength.Strong;
  let additionalInfo: string[] = [];

  // 2. Same manufacturer + same committee
  if (
    sourceDevice.applicant === targetDevice.applicant &&
    sourceDevice.advisory_committee_description ===
      targetDevice.advisory_committee_description
  ) {
    additionalInfo.push("Same Manufacturer Portfolio");
    strength = RelationshipStrength.Strong;
  }
  // 3. Same advisory committee
  else if (
    sourceDevice.advisory_committee_description ===
    targetDevice.advisory_committee_description
  ) {
    additionalInfo.push("Same Advisory");
    strength = RelationshipStrength.Strong;
  }
  // 4. Same device class
  else if (
    sourceDevice.openfda?.device_class === targetDevice.openfda?.device_class
  ) {
    additionalInfo.push("Same Device Class");
    strength = RelationshipStrength.Medium;
  }
  // 5. Cross-category
  else {
    additionalInfo.push("Cross Category");
    strength = RelationshipStrength.Weak;
  }

  const finalType =
    additionalInfo.length > 0
      ? `${baseType} - ${additionalInfo.join(", ")}`
      : baseType;

  return {
    type: finalType,
    strength,
    description: `Regulatory predicate relationship${
      additionalInfo.length > 0
        ? ` with ${additionalInfo.join(" and ").toLowerCase()}`
        : ""
    }`,
  };
};

export const calculateApprovalTimeline = (
  source: FDADevice,
  target: FDADevice
) => {
  const sourceDate = new Date(source.decision_date);
  const targetDate = new Date(target.decision_date);
  const diffTime = Math.abs(targetDate.getTime() - sourceDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isTargetLater = targetDate > sourceDate;
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);

  let description = "";
  if (years > 0) {
    description = `${years} year${years > 1 ? "s" : ""} ${
      isTargetLater ? "later" : "earlier"
    }`;
  } else if (months > 0) {
    description = `${months} month${months > 1 ? "s" : ""} ${
      isTargetLater ? "later" : "earlier"
    }`;
  } else {
    description = `${diffDays} day${diffDays > 1 ? "s" : ""} ${
      isTargetLater ? "later" : "earlier"
    }`;
  }

  return {
    sourceDate: source.decision_date,
    targetDate: target.decision_date,
    daysDifference: diffDays,
    description,
  };
};

export const calculateRiskComparison = (
  source: FDADevice,
  target: FDADevice
) => {
  const sourceClass = parseInt(source.openfda?.device_class || "1");
  const targetClass = parseInt(target.openfda?.device_class || "1");

  let riskLevel: "Lower Risk" | "Same Risk" | "Higher Risk";

  if (sourceClass < targetClass) {
    riskLevel = "Higher Risk";
  } else if (sourceClass > targetClass) {
    riskLevel = "Lower Risk";
  } else {
    riskLevel = "Same Risk";
  }

  return {
    sourceClass: source.openfda?.device_class || "1",
    targetClass: target.openfda?.device_class || "1",
    riskLevel,
  };
};
