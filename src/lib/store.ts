import { create } from 'zustand';
import { CartItem, Mission, MissionType, Product, Template } from './types';
import { mockPastMissions } from './mock-data';

interface MissionStore {
  // Mission declaration state
  declaredMissionType: MissionType | null;
  guestCount: number;
  missionDate: string;
  setDeclaredMission: (type: MissionType, guests: number, date: string) => void;
  
  // Template state
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template) => void;
  
  // Curating state
  isCurating: boolean;
  setCurating: (isCurating: boolean) => void;
  
  // Cart state
  cart: CartItem[];
  setCart: (items: CartItem[]) => void;
  swapCartItem: (oldProductId: string, newItem: CartItem) => void;
  
  // Past Missions state
  pastMissions: Mission[];
  addCompletedMission: (mission: Mission) => void;
  
  // Reset
  resetMission: () => void;
}

export const useMissionStore = create<MissionStore>((set) => ({
  declaredMissionType: null,
  guestCount: 6,
  missionDate: 'Saturday, May 16, 2026',
  setDeclaredMission: (type, guests, date) => set({ declaredMissionType: type, guestCount: guests, missionDate: date }),
  
  selectedTemplate: null,
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  
  isCurating: false,
  setCurating: (isCurating) => set({ isCurating }),
  
  cart: [],
  setCart: (items) => set({ cart: items }),
  swapCartItem: (oldProductId, newItem) => set((state) => ({
    cart: state.cart.map(item => item.product.id === oldProductId ? newItem : item)
  })),
  
  pastMissions: mockPastMissions,
  addCompletedMission: (mission) => set((state) => ({
    pastMissions: [mission, ...state.pastMissions]
  })),
  
  resetMission: () => set({ declaredMissionType: null, selectedTemplate: null, cart: [] }),
}));
