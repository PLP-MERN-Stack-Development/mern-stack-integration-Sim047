
import { useState, useCallback } from 'react';
import api from '../api/apiClient';
export default function useApi(){ const [loading,setLoading]=useState(false); const [error,setError]=useState(null); const request=useCallback(async(fn)=>{ setLoading(true); setError(null); try{ const res=await fn(); setLoading(false); return res.data }catch(err){ setLoading(false); setError(err.response?.data?.error||err.message); throw err } },[]); return {loading,error,request,setError}; }
