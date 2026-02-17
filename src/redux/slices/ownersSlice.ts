import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Owner, ApiState } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface OwnersState extends ApiState {
  owners: Owner[];
  selectedOwner: Owner | null;
}

const initialState: OwnersState = {
  owners: [],
  selectedOwner: null,
  loading: false,
  error: null,
};

export const fetchOwners = createAsyncThunk('owners/fetchAll', async () => {
  const { data, error } = await supabase.from('owners').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map((o: any) => ({
    id: o.id, firstName: o.first_name, lastName: o.last_name, email: o.email,
    phone: o.phone, address: o.address, localsCount: o.locals_count, createdAt: o.created_at,
  })) as Owner[];
});

export const addOwner = createAsyncThunk('owners/add', async (owner: Omit<Owner, 'id' | 'createdAt' | 'localsCount'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');
  const { data, error } = await supabase.from('owners').insert({
    user_id: user.id, first_name: owner.firstName, last_name: owner.lastName,
    email: owner.email, phone: owner.phone, address: owner.address,
  }).select().single();
  if (error) throw new Error(error.message);
  return {
    id: data.id, firstName: data.first_name, lastName: data.last_name, email: data.email,
    phone: data.phone, address: data.address, localsCount: data.locals_count, createdAt: data.created_at,
  } as Owner;
});

export const updateOwner = createAsyncThunk('owners/update', async (owner: Owner) => {
  const { error } = await supabase.from('owners').update({
    first_name: owner.firstName, last_name: owner.lastName, email: owner.email,
    phone: owner.phone, address: owner.address, locals_count: owner.localsCount,
  }).eq('id', owner.id);
  if (error) throw new Error(error.message);
  return owner;
});

export const deleteOwner = createAsyncThunk('owners/delete', async (id: string) => {
  const { error } = await supabase.from('owners').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return id;
});

const ownersSlice = createSlice({
  name: 'owners',
  initialState,
  reducers: {
    setSelectedOwner: (state, action: PayloadAction<Owner | null>) => { state.selectedOwner = action.payload; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwners.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOwners.fulfilled, (state, action) => { state.loading = false; state.owners = action.payload; })
      .addCase(fetchOwners.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Erreur'; })
      .addCase(addOwner.fulfilled, (state, action) => { state.owners.unshift(action.payload); })
      .addCase(updateOwner.fulfilled, (state, action) => {
        const i = state.owners.findIndex((o) => o.id === action.payload.id);
        if (i !== -1) state.owners[i] = action.payload;
      })
      .addCase(deleteOwner.fulfilled, (state, action) => {
        state.owners = state.owners.filter((o) => o.id !== action.payload);
      });
  },
});

export const { setSelectedOwner, clearError } = ownersSlice.actions;
export default ownersSlice.reducer;
