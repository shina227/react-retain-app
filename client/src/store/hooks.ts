import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';

// Typed versions of useDispatch / useSelector; use these everywhere instead.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
