import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getSupabaseClient } from '../lib/supabase';

const AuthContext = createContext(null);
const ALLOWED_ROLES = new Set(['admin', 'editor', 'student']);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleError, setRoleError] = useState(false);
  const [configurationError, setConfigurationError] = useState(false);
  const [supabase, setSupabase] = useState(null);
  const sessionUserId = useRef(null);

  const loadRole = useCallback(async (client, userId) => {
    if (!client || !userId) {
      setRole(null);
      setRoleError(false);
      return null;
    }

    const { data, error } = await client
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      if (import.meta.env.DEV) console.error('Unable to load the signed-in user role:', error);
      setRole(null);
      setRoleError(true);
      return null;
    }

    const nextRole = ALLOWED_ROLES.has(data?.role) ? data.role : null;
    setRole(nextRole);
    setRoleError(false);
    return nextRole;
  }, []);

  useEffect(() => {
    let active = true;
    let client = null;
    let initialization = null;
    let subscription = null;
    let authChangeTimer = null;
    const applySession = async (nextSession) => {
      if (!active) return;
      setSession(nextSession);
      sessionUserId.current = nextSession?.user?.id || null;
      if (nextSession?.user?.id) {
        await loadRole(client, nextSession.user.id);
      } else {
        setRole(null);
        setRoleError(false);
      }
      if (active) setLoading(false);
    };

    const initialize = () => {
      if (initialization) return;

      setLoading(true);
      initialization = getSupabaseClient()
        .then(async (supabaseClient) => {
          if (!active) return;
          client = supabaseClient;
          setSupabase(supabaseClient);
          const { data, error } = await supabaseClient.auth.getSession();
          if (error) throw error;
          await applySession(data?.session || null);
          if (!active) return;
          const authSubscription = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
            if (authChangeTimer) window.clearTimeout(authChangeTimer);
            authChangeTimer = window.setTimeout(() => {
              const sameUser = sessionUserId.current && sessionUserId.current === nextSession?.user?.id;
              if (sameUser) setSession(nextSession);
              else void applySession(nextSession);
            }, 0);
          });
          subscription = authSubscription.data.subscription;
          setConfigurationError(false);
        })
        .catch((error) => {
          if (import.meta.env.DEV) console.error('Unable to initialize Supabase authentication:', error);
          if (active) {
            setConfigurationError(true);
            setLoading(false);
          }
        });
    };

    initialize();
    window.addEventListener('popstate', initialize);

    return () => {
      active = false;
      window.removeEventListener('popstate', initialize);
      if (authChangeTimer) window.clearTimeout(authChangeTimer);
      subscription?.unsubscribe();
    };
  }, [loadRole]);

  const signInWithPassword = useCallback(async (email, password) => {
    const client = supabase || await getSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { error };
    setSession(data.session);
    sessionUserId.current = data.user.id;
    const nextRole = await loadRole(client, data.user.id);
    return { error: null, role: nextRole };
  }, [loadRole, supabase]);

  const signInWithMagicLink = useCallback(async (email) => {
    const client = supabase || await getSupabaseClient();
    return client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/connexion` },
    });
  }, [supabase]);

  const signOut = useCallback(async () => {
    const client = supabase || await getSupabaseClient();
    const result = await client.auth.signOut();
    if (!result.error) {
      setSession(null);
      sessionUserId.current = null;
      setRole(null);
    }
    return result;
  }, [supabase]);

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    role,
    loading,
    roleError,
    configurationError,
    supabase,
    isStaff: role === 'admin' || role === 'editor',
    signInWithPassword,
    signInWithMagicLink,
    signOut,
  }), [session, role, loading, roleError, configurationError, supabase, signInWithPassword, signInWithMagicLink, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
