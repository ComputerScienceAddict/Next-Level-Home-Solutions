/**
 * Browser Geolocation API (GPS permission prompt).
 * Returns lat/long when user grants access, or permission_denied / timeout.
 */

export type GeoLocationResult =
  | { status: 'granted'; lat: number; lng: number }
  | { status: 'denied' | 'unavailable' | 'timeout'; error?: string }
  | { status: 'pending' };

export async function requestBrowserLocation(timeoutMs = 10000): Promise<GeoLocationResult> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return { status: 'unavailable', error: 'Geolocation not supported' };
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ status: 'timeout', error: 'Location request timed out' });
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeout);
        resolve({
          status: 'granted',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        clearTimeout(timeout);
        if (err.code === err.PERMISSION_DENIED) {
          resolve({ status: 'denied', error: 'User denied location access' });
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          resolve({ status: 'unavailable', error: 'Position unavailable' });
        } else {
          resolve({ status: 'timeout', error: err.message });
        }
      },
      { timeout: timeoutMs, enableHighAccuracy: false, maximumAge: 300000 }
    );
  });
}
