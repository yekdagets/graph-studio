import { Node, Edge } from "@xyflow/react";

export interface FDADevice {
  k_number: string;
  device_name: string;
  applicant: string;
  date_received: string;
  decision_date: string;
  decision_description: string;
  product_code: string;
  statement_or_summary: string;
  advisory_committee_description?: string;
  predicate_device_numbers?: string[];
  openfda?: {
    device_class?: string;
  };
}

export interface OpenFDAResponse {
  meta: {
    disclaimer: string;
    terms: string;
    license: string;
    last_updated: string;
    results: {
      skip: number;
      limit: number;
      total: number;
    };
  };
  results: FDADevice[];
}

export type DeviceNodeData = {
  device: FDADevice;
  label: string;
  isSelected?: boolean;
};

export type DeviceNode = Node<DeviceNodeData, "deviceNode">;
export type DeviceEdge = Edge;

export interface GraphData {
  nodes: DeviceNode[];
  edges: DeviceEdge[];
}

export interface SearchParams {
  query?: string;
  kNumber?: string;
  applicant?: string;
  productCode?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  skip?: number;
}

export interface SearchResult {
  devices: FDADevice[];
  total: number;
  hasMore: boolean;
}

export interface SelectedDevice {
  device: FDADevice;
  predicates: FDADevice[];
  dependents: FDADevice[];
}

export enum RelationshipStrength {
  Strong = "Strong",
  Medium = "Medium",
  Weak = "Weak",
}

export interface RelationshipType {
  type: string;
  strength: RelationshipStrength;
  description: string;
}

export interface EdgeTooltipData {
  relationship: RelationshipType;
  approvalTimeline: {
    sourceDate: string;
    targetDate: string;
    daysDifference: number;
    description: string;
  };
  riskComparison: {
    sourceClass: string;
    targetClass: string;
    riskLevel: "Lower Risk" | "Same Risk" | "Higher Risk";
  };
  confidence: number;
}
