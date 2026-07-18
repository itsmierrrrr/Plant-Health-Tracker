let googleScriptPromise: Promise<void> | null = null;

type GoogleTokenClient = {
  requestAccessToken: (options?: { prompt?: 'none' | 'consent' | 'select_account' }) => void;
};

type GoogleIdentityWindow = Window & {
  google?: {
    accounts?: {
      oauth2?: {
        initTokenClient: (config: {
          client_id: string;
          scope: string;
          callback: (response: { access_token?: string; error?: string }) => void;
        }) => GoogleTokenClient;
      };
    };
  };
};

function getWindow() {
  return window as GoogleIdentityWindow;
}

export function loadGoogleIdentityScript() {
  const googleWindow = getWindow();

  if (googleWindow.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-identity="true"]');

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Google sign-in script.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Google sign-in script.'));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export async function requestGoogleAccessToken(clientId: string) {
  await loadGoogleIdentityScript();

  const googleWindow = getWindow();
  const tokenClient = googleWindow.google?.accounts?.oauth2?.initTokenClient;

  if (!tokenClient) {
    throw new Error('Google sign-in is unavailable.');
  }

  return new Promise<string>((resolve, reject) => {
    const client = tokenClient({
      client_id: clientId,
      scope: 'openid profile email',
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error('Google sign-in was cancelled or failed.'));
          return;
        }

        resolve(response.access_token);
      },
    });

    client.requestAccessToken({ prompt: 'select_account' });
  });
}