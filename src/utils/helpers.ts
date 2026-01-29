// Node24 Helper Functions

import { ScheduleNode, DaySchedule, MINUTES_IN_DAY, DEFAULT_NEW_NODE_DURATION } from '../types';
import { NodeColorKey, nodeColorKeys } from '../theme/colors';

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Parse YYYY-MM-DD to Date
export const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Format date for display (e.g., "January 29, 2026")
export const formatDateDisplay = (dateString: string): string => {
  const date = parseDate(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format date for short display (e.g., "Jan 29")
export const formatDateShort = (dateString: string): string => {
  const date = parseDate(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Get today's date string
export const getTodayString = (): string => {
  return formatDate(new Date());
};

// Format minutes to display string (e.g., "2hr 30min" or "45min")
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}min`;
  } else if (mins === 0) {
    return `${hours}hr`;
  } else {
    return `${hours}hr ${mins}min`;
  }
};

// Format minutes to time (e.g., "2:30 PM")
export const minutesToTime = (totalMinutes: number): string => {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
};

// Get start time for a node based on its position
export const getNodeStartTime = (nodes: ScheduleNode[], nodeIndex: number): number => {
  let startMinutes = 0;
  for (let i = 0; i < nodeIndex; i++) {
    startMinutes += nodes[i].durationMinutes;
  }
  return startMinutes;
};

// Create a filler node
export const createFillerNode = (durationMinutes: number, startMinutes: number = 0): ScheduleNode => {
  return {
    id: generateId(),
    name: '',
    durationMinutes,
    startMinutes,
    color: 'blue', // Doesn't matter for filler
    notes: '',
    isFiller: true,
    isLocked: false,
    repeatRule: { type: 'none' },
    reminder: { enabled: false, minutesBefore: 10 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

// Create a new regular node
export const createNode = (
  name: string,
  durationMinutes: number = DEFAULT_NEW_NODE_DURATION,
  color: NodeColorKey = 'blue',
  startMinutes: number = 0
): ScheduleNode => {
  return {
    id: generateId(),
    name,
    durationMinutes,
    startMinutes,
    color,
    notes: '',
    isFiller: false,
    isLocked: false,
    repeatRule: { type: 'none' },
    reminder: { enabled: false, minutesBefore: 10 },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

// Create a default day schedule (one big filler)
export const createDefaultDaySchedule = (date: string): DaySchedule => {
  return {
    date,
    nodes: [createFillerNode(MINUTES_IN_DAY)],
    updatedAt: Date.now(),
  };
};

// Validate that nodes sum to 1440 minutes
export const validateNodesDuration = (nodes: ScheduleNode[]): boolean => {
  const total = nodes.reduce((sum, node) => sum + node.durationMinutes, 0);
  return total === MINUTES_IN_DAY;
};

// Add a new node to the schedule, splitting filler if needed
export const addNodeToSchedule = (
  nodes: ScheduleNode[],
  newNode: ScheduleNode,
  insertIndex?: number
): ScheduleNode[] => {
  // If no nodes or all fillers, put new node in middle
  if (nodes.length === 0) {
    const remainingTime = MINUTES_IN_DAY - newNode.durationMinutes;
    const halfRemaining = Math.floor(remainingTime / 2);
    return [
      createFillerNode(halfRemaining),
      newNode,
      createFillerNode(remainingTime - halfRemaining),
    ].filter(n => n.durationMinutes > 0);
  }
  
  // Find the largest filler to split
  let largestFillerIndex = -1;
  let largestFillerDuration = 0;
  
  nodes.forEach((node, index) => {
    if (node.isFiller && node.durationMinutes > largestFillerDuration) {
      largestFillerIndex = index;
      largestFillerDuration = node.durationMinutes;
    }
  });
  
  if (largestFillerIndex === -1 || largestFillerDuration < newNode.durationMinutes) {
    // No space - shouldn't happen in normal use
    console.warn('No space to add node');
    return nodes;
  }
  
  // Split the filler
  const filler = nodes[largestFillerIndex];
  const remainingDuration = filler.durationMinutes - newNode.durationMinutes;
  const halfRemaining = Math.floor(remainingDuration / 2);
  
  const newNodes = [...nodes];
  
  // Remove the filler
  newNodes.splice(largestFillerIndex, 1);
  
  // Insert filler before, new node, filler after
  const insertItems: ScheduleNode[] = [];
  if (halfRemaining > 0) {
    insertItems.push(createFillerNode(halfRemaining));
  }
  insertItems.push(newNode);
  if (remainingDuration - halfRemaining > 0) {
    insertItems.push(createFillerNode(remainingDuration - halfRemaining));
  }
  
  newNodes.splice(largestFillerIndex, 0, ...insertItems);
  
  // Merge adjacent fillers
  return mergeAdjacentFillers(newNodes);
};

// Remove a node and expand adjacent filler
export const removeNodeFromSchedule = (
  nodes: ScheduleNode[],
  nodeId: string
): ScheduleNode[] => {
  const nodeIndex = nodes.findIndex(n => n.id === nodeId);
  if (nodeIndex === -1) return nodes;
  
  const removedNode = nodes[nodeIndex];
  if (removedNode.isFiller) return nodes; // Can't remove fillers directly
  
  const newNodes = [...nodes];
  
  // Replace the node with a filler of the same duration
  newNodes[nodeIndex] = createFillerNode(removedNode.durationMinutes);
  
  // Merge adjacent fillers
  return mergeAdjacentFillers(newNodes);
};

// Merge adjacent filler nodes
export const mergeAdjacentFillers = (nodes: ScheduleNode[]): ScheduleNode[] => {
  if (nodes.length <= 1) return nodes;
  
  const result: ScheduleNode[] = [];
  
  for (const node of nodes) {
    const lastNode = result[result.length - 1];
    
    if (lastNode && lastNode.isFiller && node.isFiller) {
      // Merge with previous filler
      lastNode.durationMinutes += node.durationMinutes;
      lastNode.updatedAt = Date.now();
    } else {
      result.push({ ...node });
    }
  }
  
  return result;
};

// Update node duration and adjust adjacent fillers
export const updateNodeDuration = (
  nodes: ScheduleNode[],
  nodeId: string,
  newDuration: number
): ScheduleNode[] => {
  const nodeIndex = nodes.findIndex(n => n.id === nodeId);
  if (nodeIndex === -1) return nodes;
  
  const node = nodes[nodeIndex];
  const durationDelta = newDuration - node.durationMinutes;
  
  if (durationDelta === 0) return nodes;
  
  const newNodes = [...nodes];
  
  // Update the node's duration
  newNodes[nodeIndex] = { ...node, durationMinutes: newDuration, updatedAt: Date.now() };
  
  // Find adjacent filler to adjust
  // Prefer the filler after, then before
  let fillerIndex = -1;
  if (nodeIndex + 1 < newNodes.length && newNodes[nodeIndex + 1].isFiller) {
    fillerIndex = nodeIndex + 1;
  } else if (nodeIndex - 1 >= 0 && newNodes[nodeIndex - 1].isFiller) {
    fillerIndex = nodeIndex - 1;
  }
  
  if (fillerIndex !== -1) {
    const filler = newNodes[fillerIndex];
    const newFillerDuration = filler.durationMinutes - durationDelta;
    
    if (newFillerDuration <= 0) {
      // Remove the filler entirely
      newNodes.splice(fillerIndex, 1);
      // TODO: Handle case where we need more space
    } else {
      newNodes[fillerIndex] = {
        ...filler,
        durationMinutes: newFillerDuration,
        updatedAt: Date.now(),
      };
    }
  }
  
  return mergeAdjacentFillers(newNodes);
};

// Get a random node color
export const getRandomNodeColor = (): NodeColorKey => {
  const randomIndex = Math.floor(Math.random() * nodeColorKeys.length);
  return nodeColorKeys[randomIndex];
};

// Check if a date is today
export const isToday = (dateString: string): boolean => {
  return dateString === getTodayString();
};

// Get previous day
export const getPreviousDay = (dateString: string): string => {
  const date = parseDate(dateString);
  date.setDate(date.getDate() - 1);
  return formatDate(date);
};

// Get next day
export const getNextDay = (dateString: string): string => {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + 1);
  return formatDate(date);
};
