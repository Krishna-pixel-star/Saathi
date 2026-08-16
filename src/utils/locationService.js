

export function requestGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: 'UNSUPPORTED', message: 'Geolocation is not supported by this browser.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject({ code: 'PERMISSION_DENIED', message: 'Location permission denied.' });
            break;
          case error.POSITION_UNAVAILABLE:
            reject({ code: 'POSITION_UNAVAILABLE', message: 'Location information is unavailable.' });
            break;
          case error.TIMEOUT:
            reject({ code: 'TIMEOUT', message: 'Location request timed out.' });
            break;
          default:
            reject({ code: 'UNKNOWN', message: 'An unknown error occurred.' });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

export async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',

        'User-Agent': 'SAATHI-AgriculturalApp/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    const addr = data.address || {};

    const locality =
      addr.village ||
      addr.hamlet ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.locality ||
      '';

    const city =
      addr.town ||
      addr.city ||
      addr.municipality ||
      addr.county ||
      '';

    const district =
      addr.county ||
      addr.district ||
      addr.state_district ||
      city ||
      '';

    const state = addr.state || '';
    const country = addr.country || 'India';

    const parts = [locality, city, district, state].filter(
      (p, i, arr) => p && arr.indexOf(p) === i 
    );
    const formatted = parts.join(', ') || data.display_name?.split(',').slice(0, 3).join(',') || '';

    return {
      locality,
      city,
      district,
      state,
      country,
      formatted,
      raw: addr,
    };
  } catch (err) {

    return {
      locality: '',
      city: '',
      district: '',
      state: '',
      country: 'India',
      formatted: '',
      raw: {},
    };
  }
}
