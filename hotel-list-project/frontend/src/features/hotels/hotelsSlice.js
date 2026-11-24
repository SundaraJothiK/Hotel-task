import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/hotelApi';
export const fetchHotels = createAsyncThunk('hotels/fetch', async (params, { rejectWithValue }) => { try { return (await api.get('/hotels', { params })).data; } catch (e) { return rejectWithValue(e.response?.data?.message || 'Could not load hotels.'); } });
export const fetchHotel = createAsyncThunk('hotels/fetchOne', async (id, { rejectWithValue }) => { try { return (await api.get(`/hotels/${id}`)).data; } catch (e) { return rejectWithValue(e.response?.data?.message || 'Could not load hotel.'); } });
export const saveHotel = createAsyncThunk('hotels/save', async ({ id, formData }, { rejectWithValue }) => { try { const config = { headers: { 'Content-Type': 'multipart/form-data' } }; return id ? (await api.put(`/hotels/${id}`, formData, config)).data : (await api.post('/hotels', formData, config)).data; } catch (e) { return rejectWithValue(e.response?.data?.message || 'Could not save hotel.'); } });
export const deleteHotel = createAsyncThunk('hotels/delete', async (id, { rejectWithValue }) => { try { await api.delete(`/hotels/${id}`); return id; } catch (e) { return rejectWithValue(e.response?.data?.message || 'Could not delete hotel.'); } });
const slice = createSlice({ name: 'hotels', initialState: { items: [], total: 0, selected: null, loading: false, error: null }, reducers: { clearSelected: (s) => { s.selected = null; }, clearError: (s) => { s.error = null; } }, extraReducers: (b) => {
 b.addCase(fetchHotels.pending, s => { s.loading = true; s.error = null; }).addCase(fetchHotels.fulfilled, (s,a) => { s.loading=false; s.items=a.payload.hotels; s.total=a.payload.total; }).addCase(fetchHotels.rejected, (s,a) => { s.loading=false; s.error=a.payload; });
 b.addCase(fetchHotel.pending, s => { s.loading=true; s.selected=null; s.error=null; }).addCase(fetchHotel.fulfilled, (s,a) => { s.loading=false; s.selected=a.payload; }).addCase(fetchHotel.rejected, (s,a) => { s.loading=false; s.error=a.payload; });
 b.addCase(saveHotel.fulfilled, (s,a) => { s.items=[a.payload,...s.items.filter(h=>h.id!==a.payload.id)]; }).addCase(deleteHotel.fulfilled, (s,a) => { s.items=s.items.filter(h=>h.id!==a.payload); s.total=Math.max(0,s.total-1); }).addCase(deleteHotel.rejected, (s,a) => { s.error=a.payload; });
}});
export const { clearSelected, clearError } = slice.actions;
export default slice.reducer;
