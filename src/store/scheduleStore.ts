// Node24 Schedule Store - State Management with AsyncStorage

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ScheduleNode, 
  DaySchedule, 
  AppState,
  MINUTES_IN_DAY,
  DEFAULT_NEW_NODE_DURATION,
} from '../types';
import {
  getTodayString,
  createDefaultDaySchedule,
  addNodeToSchedule,
  removeNodeFromSchedule,
  updateNodeDuration,
  createNode,
  mergeAdjacentFillers,
  getRandomNodeColor,
} from '../utils/helpers';
import { NodeColorKey } from '../theme/colors';

interface ScheduleStore extends AppState {
  // Actions
  setCurrentDate: (date: string) => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  goToToday: () => void;
  
  // Node actions
  addNode: (name?: string, color?: NodeColorKey) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<ScheduleNode>) => void;
  updateNodeDurationAction: (nodeId: string, newDuration: number) => void;
  reorderNodes: (newNodes: ScheduleNode[]) => void;
  resizeNode: (nodeId: string, newStartMinutes: number, newDuration: number) => void;
  toggleNodeLock: (nodeId: string) => void;
  
  // Edit mode
  toggleEditMode: () => void;
  setEditMode: (isEdit: boolean) => void;
  
  // Premium
  setPremium: (isPremium: boolean) => void;
  
  // Helpers
  getCurrentDaySchedule: () => DaySchedule;
  getOrCreateDaySchedule: (date: string) => DaySchedule;
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentDate: getTodayString(),
      schedules: {},
      isEditMode: false,
      isPremium: false,
      
      // Date navigation
      setCurrentDate: (date) => set({ currentDate: date }),
      
      goToPreviousDay: () => {
        const current = get().currentDate;
        // Parse as local date to avoid timezone issues
        const [year, month, day] = current.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() - 1);
        const newYear = date.getFullYear();
        const newMonth = String(date.getMonth() + 1).padStart(2, '0');
        const newDay = String(date.getDate()).padStart(2, '0');
        set({ currentDate: `${newYear}-${newMonth}-${newDay}` });
      },
      
      goToNextDay: () => {
        const current = get().currentDate;
        // Parse as local date to avoid timezone issues
        const [year, month, day] = current.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + 1);
        const newYear = date.getFullYear();
        const newMonth = String(date.getMonth() + 1).padStart(2, '0');
        const newDay = String(date.getDate()).padStart(2, '0');
        set({ currentDate: `${newYear}-${newMonth}-${newDay}` });
      },
      
      goToToday: () => set({ currentDate: getTodayString() }),
      
      // Get current day schedule
      getCurrentDaySchedule: () => {
        const { currentDate, schedules } = get();
        return schedules[currentDate] || createDefaultDaySchedule(currentDate);
      },
      
      getOrCreateDaySchedule: (date) => {
        const { schedules } = get();
        if (schedules[date]) {
          return schedules[date];
        }
        const newSchedule = createDefaultDaySchedule(date);
        set((state) => ({
          schedules: {
            ...state.schedules,
            [date]: newSchedule,
          },
        }));
        return newSchedule;
      },
      
      // Add a new node
      addNode: (name = 'New Node', color) => {
        const { currentDate, schedules } = get();
        const currentSchedule = schedules[currentDate] || createDefaultDaySchedule(currentDate);
        
        const newNode = createNode(name, DEFAULT_NEW_NODE_DURATION, color || getRandomNodeColor());
        const newNodes = addNodeToSchedule(currentSchedule.nodes, newNode);
        
        set((state) => ({
          schedules: {
            ...state.schedules,
            [currentDate]: {
              ...currentSchedule,
              nodes: newNodes,
              updatedAt: Date.now(),
            },
          },
        }));
      },
      
      // Remove a node
      removeNode: (nodeId) => {
        const { currentDate, schedules } = get();
        const currentSchedule = schedules[currentDate];
        if (!currentSchedule) return;
        
        const newNodes = removeNodeFromSchedule(currentSchedule.nodes, nodeId);
        
        set((state) => ({
          schedules: {
            ...state.schedules,
            [currentDate]: {
              ...currentSchedule,
              nodes: newNodes,
              updatedAt: Date.now(),
            },
          },
        }));
      },
      
      // Update a node's properties
      updateNode: (nodeId, updates) => {
        const { currentDate, schedules } = get();
        const currentSchedule = schedules[currentDate];
        if (!currentSchedule) return;
        
        const newNodes = currentSchedule.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, ...updates, updatedAt: Date.now() }
            : node
        );
        
        set((state) => ({
          schedules: {
            ...state.schedules,
            [currentDate]: {
              ...currentSchedule,
              nodes: newNodes,
              updatedAt: Date.now(),
            },
          },
        }));
      },
      
      // Update node duration
      updateNodeDurationAction: (nodeId, newDuration) => {
        const { currentDate, schedules } = get();
        const currentSchedule = schedules[currentDate];
        if (!currentSchedule) return;
        
        const newNodes = updateNodeDuration(currentSchedule.nodes, nodeId, newDuration);
        
        set((state) => ({
          schedules: {
            ...state.schedules,
            [currentDate]: {
              ...currentSchedule,
              nodes: newNodes,
              updatedAt: Date.now(),
            },
          },
        }));
      },
      
      // Reorder nodes (after drag)
      reorderNodes: (newNodes) => {
        const { currentDate, schedules } = get();
        const currentSchedule = schedules[currentDate];
        if (!currentSchedule) return;
        
        // Merge adjacent fillers after reorder
        const mergedNodes = mergeAdjacentFillers(newNodes);
        
        set((state) => ({
          schedules: {
            ...state.schedules,
            [currentDate]: {
              ...currentSchedule,
              nodes: mergedNodes,
              updatedAt: Date.now(),
            },
          },
        }));
      },
      
      // Resize a node by changing its start time and/or duration
      resizeNode: (nodeId, newStartMinutes, newDuration) => {
        const { currentDate, schedules } = get();
        const currentSchedule = schedules[currentDate];
        if (!currentSchedule) return;
        
        // Find the node and update it
        const nodeIndex = currentSchedule.nodes.findIndex(n => n.id === nodeId);
        if (nodeIndex === -1) return;
        
        const node = currentSchedule.nodes[nodeIndex];
        if (node.isLocked) return; // Can't resize locked nodes
        
        // Create updated node
        const updatedNode = {
          ...node,
          startMinutes: newStartMinutes,
          durationMinutes: Math.max(15, Math.min(newDuration, MINUTES_IN_DAY)),
          updatedAt: Date.now(),
        };
        
        // Rebuild the nodes array maintaining correct order and filler space
        let newNodes: ScheduleNode[] = [];
        let currentMinute = 0;
        
        // Sort all non-filler nodes by their start times
        const userNodes = currentSchedule.nodes
          .filter(n => !n.isFiller)
          .map(n => n.id === nodeId ? updatedNode : n)
          .sort((a, b) => a.startMinutes - b.startMinutes);
        
        // Rebuild with fillers
        for (const userNode of userNodes) {
          // Add filler before if needed
          if (userNode.startMinutes > currentMinute) {
            const fillerDuration = userNode.startMinutes - currentMinute;
            if (fillerDuration > 0) {
              newNodes.push({
                id: `filler-${currentMinute}`,
                name: '',
                durationMinutes: fillerDuration,
                startMinutes: currentMinute,
                isFiller: true,
                isLocked: false,
                color: 'blue', // Placeholder, filler uses its own style
                repeatRule: { type: 'none' },
                reminder: { enabled: false, minutesBefore: 10 },
                createdAt: Date.now(),
                updatedAt: Date.now(),
              });
            }
          }
          
          // Add the user node
          newNodes.push(userNode);
          currentMinute = userNode.startMinutes + userNode.durationMinutes;
        }
        
        // Add trailing filler if needed
        if (currentMinute < MINUTES_IN_DAY) {
          newNodes.push({
            id: `filler-${currentMinute}`,
            name: '',
            durationMinutes: MINUTES_IN_DAY - currentMinute,
            startMinutes: currentMinute,
            isFiller: true,
            isLocked: false,
            color: 'blue', // Placeholder, filler uses its own style
            repeatRule: { type: 'none' },
            reminder: { enabled: false, minutesBefore: 10 },
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
        
        set((state) => ({
          schedules: {
            ...state.schedules,
            [currentDate]: {
              ...currentSchedule,
              nodes: newNodes,
              updatedAt: Date.now(),
            },
          },
        }));
      },
      
      // Toggle node lock state
      toggleNodeLock: (nodeId) => {
        const { currentDate, schedules } = get();
        const currentSchedule = schedules[currentDate];
        if (!currentSchedule) return;
        
        const newNodes = currentSchedule.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, isLocked: !node.isLocked, updatedAt: Date.now() }
            : node
        );
        
        set((state) => ({
          schedules: {
            ...state.schedules,
            [currentDate]: {
              ...currentSchedule,
              nodes: newNodes,
              updatedAt: Date.now(),
            },
          },
        }));
      },
      
      // Edit mode
      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
      setEditMode: (isEdit) => set({ isEditMode: isEdit }),
      
      // Premium
      setPremium: (isPremium) => set({ isPremium }),
    }),
    {
      name: 'node24-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
