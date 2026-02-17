import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Activity, ApiState } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface ActivitiesState extends ApiState {
  activities: Activity[];
  selectedActivity: Activity | null;
}

const initialState: ActivitiesState = {
  activities: [],
  selectedActivity: null,
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk('activities/fetchAll', async () => {
  const { data, error } = await supabase.from('activities').select('*, locals(number)').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map((a: any) => ({
    id: a.id, name: a.name, type: a.type as Activity['type'],
    description: a.description || '', localId: a.local_id,
    localNumber: a.locals?.number || '', createdAt: a.created_at,
  })) as Activity[];
});

export const addActivity = createAsyncThunk('activities/add', async (activity: Omit<Activity, 'id' | 'createdAt'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');
  const { data, error } = await supabase.from('activities').insert({
    user_id: user.id, name: activity.name, type: activity.type,
    description: activity.description, local_id: activity.localId || null,
  }).select('*, locals(number)').single();
  if (error) throw new Error(error.message);
  return {
    id: data.id, name: data.name, type: data.type as Activity['type'],
    description: data.description || '', localId: data.local_id,
    localNumber: (data as any).locals?.number || '', createdAt: data.created_at,
  } as Activity;
});

export const updateActivity = createAsyncThunk('activities/update', async (activity: Activity) => {
  const { error } = await supabase.from('activities').update({
    name: activity.name, type: activity.type, description: activity.description,
    local_id: activity.localId || null,
  }).eq('id', activity.id);
  if (error) throw new Error(error.message);
  return activity;
});

export const deleteActivity = createAsyncThunk('activities/delete', async (id: string) => {
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return id;
});

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setSelectedActivity: (state, action: PayloadAction<Activity | null>) => { state.selectedActivity = action.payload; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchActivities.fulfilled, (state, action) => { state.loading = false; state.activities = action.payload; })
      .addCase(fetchActivities.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Erreur'; })
      .addCase(addActivity.fulfilled, (state, action) => { state.activities.unshift(action.payload); })
      .addCase(updateActivity.fulfilled, (state, action) => {
        const i = state.activities.findIndex((a) => a.id === action.payload.id);
        if (i !== -1) state.activities[i] = action.payload;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.activities = state.activities.filter((a) => a.id !== action.payload);
      });
  },
});

export const { setSelectedActivity, clearError } = activitiesSlice.actions;
export default activitiesSlice.reducer;
