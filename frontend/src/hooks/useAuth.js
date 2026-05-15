import { useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

export function useAuth() {
  return useContext(AuthContext);
}