import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { API } from '../lib/api';

const GOOGLE_SCRIPT_ID = 'google-identity-services';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
  || '1075678670548-1i330iun823bu7pgl1q45fng69ic91eu.apps.googleusercontent.com';

function decodeJwtPayload(token) {
  const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = encoded + '='.repeat((4 - (encoded.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function getCachedIdentity() {
  const token = localStorage.getItem('googleIdToken');
  const userId = localStorage.getItem('userId');
  if (!token || !userId) return null;

  try {
    const payload = decodeJwtPayload(token);
    const expiresAt = Number(payload.exp) * 1000;
    if (payload.sub !== userId || !expiresAt || expiresAt <= Date.now() + 30_000) {
      return null;
    }
    return { token, userId };
  } catch {
    return null;
  }
}

export default function Register() {
  const { setUserId } = useUser();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const rendered = useRef(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState(false);

  useEffect(() => {
    const cachedIdentity = getCachedIdentity();
    if (cachedIdentity) {
      setUserId(cachedIdentity.userId);
      navigate('/homepage', { replace: true });
      return undefined;
    }

    localStorage.removeItem('googleIdToken');
    localStorage.removeItem('userId');
    setCheckingSession(false);

    let cancelled = false;
    let script = document.getElementById(GOOGLE_SCRIPT_ID);

    const renderGoogleButton = () => {
      if (cancelled || rendered.current || !buttonRef.current) return;

      const googleIdentity = window.google?.accounts?.id;
      if (!googleIdentity) {
        setGoogleError(true);
        return;
      }

      rendered.current = true;
      buttonRef.current.replaceChildren();

      googleIdentity.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          try {
            const payload = decodeJwtPayload(credential);
            const { sub, email: gmail, name, picture } = payload;

            localStorage.setItem('googleIdToken', credential);
            await axios.post(`${API}/register/${sub}`, {
              gmail,
              name,
              pic: picture,
            });
            localStorage.setItem('userId', sub);
            setUserId(sub);
            navigate('/homepage');
          } catch (error) {
            console.error('Google sign-in failed:', error);
            setGoogleError(true);
          }
        },
      });

      googleIdentity.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'rectangular',
        width: Math.min(320, Math.floor(buttonRef.current.clientWidth || 320)),
      });
      setGoogleReady(true);
      setGoogleError(false);
    };

    const handleScriptError = () => {
      if (!cancelled) setGoogleError(true);
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      if (!script) {
        script = document.createElement('script');
        script.id = GOOGLE_SCRIPT_ID;
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', renderGoogleButton);
      script.addEventListener('error', handleScriptError);
    }

    return () => {
      cancelled = true;
      script?.removeEventListener('load', renderGoogleButton);
      script?.removeEventListener('error', handleScriptError);
    };
  }, [navigate, setUserId]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf7f8]">
        <span className="loading loading-spinner text-[#a94765]" aria-label="Checking login" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbf7f8] px-5 py-12">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#f4dce3] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#eee2cc] opacity-60 blur-3xl" />
      <div className="surface-card relative w-full max-w-lg px-5 py-9 text-center sm:px-12 sm:py-12">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e6eb] text-xl">✦</div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#a94765]">AcrossTime</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#30282b] sm:text-5xl">Hello there</h1>
          <p className="mx-auto max-w-md py-6 text-[15px] leading-7 text-[#776b70]">
            Effortlessly schedule meetings across time zones.
            Do you have your friends or colleagues in the different time zones?
            Do you feel troublesome calculating &quot;What is the best time for us&quot; everytime?
            Then the best app is here for you!
          </p>
          <div className="flex min-h-[44px] w-full items-center justify-center">
            <div ref={buttonRef} className="flex max-w-full justify-center overflow-hidden" />
            {!googleReady && !googleError && (
              <span className="text-sm text-gray-500">Loading Google Sign-In…</span>
            )}
          </div>
          {googleError && (
            <p className="mt-3 text-sm text-red-600">
              Google Sign-In could not be loaded. Please check your connection and try again.
            </p>
          )}
      </div>
    </div>
  );
}
