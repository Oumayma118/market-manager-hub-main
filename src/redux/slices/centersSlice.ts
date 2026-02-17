import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Center, ApiState } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface CentersState extends ApiState {
  centers: Center[];
  selectedCenter: Center | null;
}

const initialState: CentersState = {
  centers: [],
  selectedCenter: null,
  loading: false,
  error: null,
};

export const fetchCenters = createAsyncThunk('centers/fetchAll', async () => {
  const { data, error } = await supabase.from('centers').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    address: c.address,
    description: c.description || '',
    totalLocals: c.total_locals,
    availableLocals: c.available_locals,
    createdAt: c.created_at,
  })) as Center[];
});

export const addCenter = createAsyncThunk(
  'centers/add',
  async (center: Omit<Center, 'id' | 'createdAt'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');
    const { data, error } = await supabase.from('centers').insert({
      user_id: user.id,
      name: center.name,
      address: center.address,
      description: center.description,
      total_locals: center.totalLocals,
      available_locals: center.availableLocals,
    }).select().single();
    if (error) throw new Error(error.message);
    return {
      id: data.id, name: data.name, address: data.address,
      description: data.description || '', totalLocals: data.total_locals,
      availableLocals: data.available_locals, createdAt: data.created_at,
    } as Center;
  }
);

export const updateCenter = createAsyncThunk('centers/update', async (center: Center) => {
  const { error } = await supabase.from('centers').update({
    name: center.name, address: center.address, description: center.description,
    total_locals: center.totalLocals, available_locals: center.availableLocals,
  }).eq('id', center.id);
  if (error) throw new Error(error.message);
  return center;
});

export const deleteCenter = createAsyncThunk('centers/delete', async (id: string) => {
  const { error } = await supabase.from('centers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return id;
});

const centersSlice = createSlice({
  name: 'centers',
  initialState,
  reducers: {
    setSelectedCenter: (state, action: PayloadAction<Center | null>) => { state.selectedCenter = action.payload; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCenters.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCenters.fulfilled, (state, action) => { state.loading = false; state.centers = action.payload; })
      .addCase(fetchCenters.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Erreur'; })
      .addCase(addCenter.pending, (state) => { state.loading = true; })
      .addCase(addCenter.fulfilled, (state, action) => { state.loading = false; state.centers.unshift(action.payload); })
      .addCase(addCenter.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Erreur'; })
      .addCase(updateCenter.fulfilled, (state, action) => {
        const i = state.centers.findIndex((c) => c.id === action.payload.id);
        if (i !== -1) state.centers[i] = action.payload;
      })
      .addCase(deleteCenter.fulfilled, (state, action) => {
        state.centers = state.centers.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setSelectedCenter, clearError } = centersSlice.actions;
export default centersSlice.reducer;
