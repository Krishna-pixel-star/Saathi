

const EARTH_RADIUS_KM = 6371;

export function calculateDistance(lat1, lng1, lat2, lng2) {
  if (
    lat1 == null || lng1 == null ||
    lat2 == null || lng2 == null ||
    isNaN(lat1) || isNaN(lng1) ||
    isNaN(lat2) || isNaN(lng2)
  ) {
    return null;
  }

  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = EARTH_RADIUS_KM * c;

  return Math.round(distanceKm * 10) / 10; 
}

export function formatDistance(distanceKm) {
  if (distanceKm == null) return null;
  return `~${distanceKm} km`;
}
