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
        const date = new Date(current);
        date.setDate(date.getDate() - 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        set({ currentDate: `${year}-${month}-${day}` });
      },
      
      goToNextDay: () => {
        const current = get().currentDate;
        const date = new Date(current);
        date.setDate(date.getDate() + 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        set({ currentDate: `${year}-${month}-${day}` });
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
