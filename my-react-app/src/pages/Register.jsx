import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { API } from '../lib/api';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

function decodeJwtPayload(token) {
  const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = encoded + '='.repeat((4 - (encoded.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export default function Register() {
  const { setUserId } = useUser();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const rendered = useRef(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState(false);

  useEffect(() => {
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
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
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
        width: 320,
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

  return (
    <div className="hero min-h-screen bg-pink-100">
      <div className="hero-content w-full text-center">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            Effortlessly schedule meetings across time zones.
            Do you have your friends or colleagues in the different time zones?
            Do you feel troublesome calculating &quot;What is the best time for us&quot; everytime?
            Then the best app is here for you!
          </p>
          <div className="flex min-h-[44px] w-full items-center justify-center">
            <div ref={buttonRef} className="flex justify-center" />
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
    </div>
  );
}
