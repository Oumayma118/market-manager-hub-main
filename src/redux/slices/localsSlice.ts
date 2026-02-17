import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Local, ApiState } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface LocalsState extends ApiState {
  locals: Local[];
  selectedLocal: Local | null;
}

const initialState: LocalsState = {
  locals: [],
  selectedLocal: null,
  loading: false,
  error: null,
};

export const fetchLocals = createAsyncThunk('locals/fetchAll', async () => {
  const { data, error } = await supabase.from('locals').select('*, centers(name), owners(first_name, last_name)').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map((l: any) => ({
    id: l.id, number: l.number, size: Number(l.size), status: l.status as 'available' | 'rented',
    centerId: l.center_id, centerName: l.centers?.name || '',
    ownerId: l.owner_id, ownerName: l.owners ? `${l.owners.first_name} ${l.owners.last_name}` : '',
    monthlyRent: Number(l.monthly_rent), createdAt: l.created_at,
  })) as Local[];
});

export const addLocal = createAsyncThunk('locals/add', async (local: Omit<Local, 'id' | 'createdAt'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');
  const { data, error } = await supabase.from('locals').insert({
    user_id: user.id, number: local.number, size: local.size, status: local.status,
    center_id: local.centerId || null, owner_id: local.ownerId || null, monthly_rent: local.monthlyRent,
  }).select('*, centers(name), owners(first_name, last_name)').single();
  if (error) throw new Error(error.message);
  return {
    id: data.id, number: data.number, size: Number(data.size), status: data.status as 'available' | 'rented',
    centerId: data.center_id, centerName: (data as any).centers?.name || '',
    ownerId: data.owner_id, ownerName: (data as any).owners ? `${(data as any).owners.first_name} ${(data as any).owners.last_name}` : '',
    monthlyRent: Number(data.monthly_rent), createdAt: data.created_at,
  } as Local;
});

export const updateLocal = createAsyncThunk('locals/update', async (local: Local) => {
  const { error } = await supabase.from('locals').update({
    number: local.number, size: local.size, status: local.status,
    center_id: local.centerId || null, owner_id: local.ownerId || null, monthly_rent: local.monthlyRent,
  }).eq('id', local.id);
  if (error) throw new Error(error.message);
  return local;
});

export const deleteLocal = createAsyncThunk('locals/delete', async (id: string) => {
  const { error } = await supabase.from('locals').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return id;
});

const localsSlice = createSlice({
  name: 'locals',
  initialState,
  reducers: {
    setSelectedLocal: (state, action: PayloadAction<Local | null>) => { state.selectedLocal = action.payload; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocals.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLocals.fulfilled, (state, action) => { state.loading = false; state.locals = action.payload; })
      .addCase(fetchLocals.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Erreur'; })
      .addCase(addLocal.fulfilled, (state, action) => { state.locals.unshift(action.payload); })
      .addCase(updateLocal.fulfilled, (state, action) => {
        const i = state.locals.findIndex((l) => l.id === action.payload.id);
        if (i !== -1) state.locals[i] = action.payload;
      })
      .addCase(deleteLocal.fulfilled, (state, action) => {
        state.locals = state.locals.filter((l) => l.id !== action.payload);
      });
  },
});

export const { setSelectedLocal, clearError } = localsSlice.actions;
export default localsSlice.reducer;
