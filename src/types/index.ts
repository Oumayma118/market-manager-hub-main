// Types for INDH Market Manager entities

export interface Center {
  id: string;
  name: string;
  address: string;
  description: string;
  totalLocals: number;
  availableLocals: number;
  createdAt: string;
}

export interface Local {
  id: string;
  number: string;
  size: number; // in m²
  status: 'available' | 'rented';
  centerId: string;
  centerName?: string;
  ownerId?: string;
  ownerName?: string;
  activityId?: string;
  activityName?: string;
  monthlyRent: number;
  createdAt: string;
}

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  localsCount: number;
  createdAt: string;
}

export interface Activity {
  id: string;
  name: string;
  type: 'boutique' | 'restaurant' | 'service' | 'artisanat' | 'autre';
  description: string;
  localId?: string;
  localNumber?: string;
  createdAt: string;
}

export interface ApiState {
  loading: boolean;
  error: string | null;
}

export type ActivityType = Activity['type'];

export const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'boutique', label: 'Boutique' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'service', label: 'Service' },
  { value: 'artisanat', label: 'Artisanat' },
  { value: 'autre', label: 'Autre' },
];
