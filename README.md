# FDA 510(k) Device Explorer

> Interactive Graph Visualization for FDA Medical Device Relationships
## 🎯 Project Overview

* Problem Statement:
FDA 510(k) medical device data contains complex predicate relationships that are difficult to understand in traditional tabular formats. Healthcare professionals, researchers, and regulatory analysts need an intuitive way to visualize and explore these device connections to understand regulatory pathways and device evolution.
* Solution Approach: 
Built an interactive graph visualization platform that transforms FDA device data into an explorable network, revealing hidden patterns in medical device regulatory relationships through intelligent graph algorithms and rich user interactions.
* Key Innovation: 
> Relationship Intelligence Engine: Custom algorithm that analyzes device connections beyond simple predicates
> Interactive Graph Navigation: Real-time path highlighting with BFS shortest-path algorithm
> Rich Contextual Information: Smart tooltips with timeline analysis and risk assessment


## ⚡ Solution Strategy: Frontend Architecture Excellence
> This project demonstrates enterprise-grade frontend architecture through:
-  Scalable Component Architecture
- Professional UI/UX Design System ( * Visual Hierarchy: Color-coded device risk classes (Class 1: Green, Class 2: Yellow, Class 3: Red)
* Progressive Disclosure: Hover → Click → Focus interaction model
* Contextual Interface: Controls adapt to user selection state
* Premium Animations: Framer Motion integration for professional feel
* Responsive Design: Seamless experience across screen sizes)
-  Production-Ready Code Quality
- Performance-First Frontend Engineering
###  Advanced Frontend Algorithms
- Custom BFS Implementation: Hand-coded graph pathfinding in React context
- Real-time Graph Visualization: ReactFlow integration with custom node/edge components
- Intelligent Relationship Detection: Multi-tier FDA regulatory analysis engine
- Dynamic Layout Algorithms: Circular positioning with trigonometric calculations
## 🏗️ Technical Architecture

- > Frontend Framework: React 18 + TypeScript
- > Graph Visualization: ReactFlow
- > State Management: React Hooks + Custom Hooks
- > Styling: Tailwind CSS + Framer Motion

### Project Structure Philosophy
```
src/
├── components/
│   ├── custom/            # Modular sidebar components
│   │   ├── ActionsPanel.tsx          # Export and action controls
│   │   ├── DeviceDetailPanel.tsx     # Device information display
│   │   ├── ExportPanel.tsx           # Multi-format export interface
│   │   ├── PathInfoPanel.tsx         # Path analysis display
│   │   ├── SearchPanel.tsx           # Multi-criteria search
│   │   └── StatisticsPanel.tsx       # Data insights and metrics
│   ├── graph/             # ReactFlow ecosystem
│   │   ├── DeviceEdgeComponent.tsx   # Interactive relationship edges
│   │   ├── DeviceNodeComponent.tsx   # Custom FDA device nodes
│   │   ├── EdgeTooltip.tsx          # Rich relationship tooltips
│   │   ├── Flow.tsx                 # Main graph container
│   │   └── GraphControls.tsx        # Graph navigation controls
│   └── layout/            # Application layout
│       ├── AppLayout.tsx            # Main application wrapper
│       ├── Header.tsx               # Application header
│       └── Sidebar.tsx              # Main sidebar orchestrator
├── hooks/                 # Custom React hooks
│   ├── useExport.ts                 # Multi-format data export
│   ├── useFDADevices.ts             # Device data management
│   ├── useGraphControls.ts          # Graph interaction controls
│   ├── useNodeSelection.ts          # Node selection logic
│   ├── usePathHighlight.ts          # BFS pathfinding algorithm
│   └── useSearch.ts                 # Client-side filtering engine
├── mappers/
│   └── index.ts                     # Data transformation utilities
├── services/
│   └── index.ts                     # External service integrations
├── types/
│   └── index.ts                     # TypeScript definitions
└── utils/
    ├── data.ts                      # Mock FDA data
    ├── deviceHelpers.ts             # Connection analysis utilities
    └── relationshipEngine.ts        # FDA relationship intelligence
```

## 🧠 Implementation Deep Dive
### Core Algorithms & Data Structures
- >  Graph Pathfinding Algorithm (Guarantees shortest path in unweighted graphs, optimal for FDA predicate relationships)
- >  Relationship Intelligence Engine (Manufacturer portfolios,
Medical specialties (advisory committees),
Device risk classes,
Approval timelines)
- >  Performance Optimization Strategies (Prevents expensive re-calculations on every render,
Cache invalidation based on dataset changes, 
Memory-efficient with Map-based storage)
- >  Monolithic Sidebar -> Modular Architecture

## 🎨 User Experience Design Decisions
#### Interactive Graph Navigation
- > Making complex FDA data accessible to non-technical users : Progressive disclosure with contextual interactions
- Hover States: Rich tooltips without overwhelming the interface
- Click Interactions: Detailed sidebar information on demand
- Path Highlighting: Visual connection tracing between devices
-  Focus Mode with Zoom-to-Node: Floating controls for graph navigation
- Rich Interactive Tooltips with FDA Intelligence
- Smart Device Class Color Coding
- Dynamic Sidebar Content with Device Deep-Dive
- Interactive Graph Controls with Context Awareness
- Premium Animation System


#### Information Architecture
- > FDA Data Complexity: Each device has 10+ properties with nested relationships
- Primary Information: Device name, applicant prominently displayed
- Secondary Details: Expandable sections for technical data
- Relationship Context: Smart tooltips explaining connections
- Visual Hierarchy: Color coding for device classes and relationship strength

## 🔧 Examples of Development Process & Challenges
### Challenge 1: TypeScript Integration with ReactFlow
Problem: ReactFlow's generic types conflicting with custom FDA data structures
Solution Process:
```
// Initial attempt - Type conflicts
export type DeviceNode = Node<FDADevice>;

// Final solution - Proper generic extension
export type DeviceNodeData = {
  device: FDADevice;
  label: string;
  isSelected?: boolean;
};

export type DeviceNode = Node<DeviceNodeData, "deviceNode">;
```

### Challenge 2: Performance with Complex Filtering: Search filtering causing UI freezes with multiple criteria
- Identified Issue: Filter function running on every keystroke
- Profiling: React DevTools showed excessive re-renders
- Solution: useMemo with proper dependency arrays
- Result: 10x performance improvement in search responsiveness
Code Evolution:
```
// Before: Performance issue
const filteredDevices = devices.filter(device => {
  // Complex filtering on every render
});

// After: Optimized with memoization
const filteredDevices = useMemo(() => {
  return devices.filter(device => {
    // Same logic, but cached
  });
}, [devices, searchQuery, filters]);
```

## Custom Hook Architecture
* usePathHighlight: BFS algorithm + React state management
* useSearch: Client-side filtering with performance optimization
* useExport: Multi-format data export with memory management
* Separation of Concerns: Business logic extracted from UI components

## Live Link
[https://vercel.com/yekdagets-projects/graph-studio](https://graph-studio.vercel.app/)
