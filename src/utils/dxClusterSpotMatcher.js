export const buildDXSpotKey = (spot = {}) => {
  const id = typeof spot.id === 'string' ? spot.id.trim() : '';
  if (id) return id;

  const dxCall = (spot.dxCall || spot.call || '').trim().toUpperCase();
  const freq = String(spot.freq || '').trim();
  const spotter = (spot.spotter || '').trim().toUpperCase();

  if (!dxCall) return '';

  return `${dxCall}|${freq}|${spotter}`;
};

export const matchesDXSpotPath = (spot, path) => {
  const spotKey = buildDXSpotKey(spot);
  const pathKey = buildDXSpotKey(path);

  if (spotKey && pathKey) return spotKey === pathKey;

  return (
    (spot?.call || '').trim().toUpperCase() === (path?.dxCall || '').trim().toUpperCase() &&
    String(spot?.freq || '').trim() === String(path?.freq || '').trim() &&
    (spot?.spotter || '').trim().toUpperCase() === (path?.spotter || '').trim().toUpperCase()
  );
};

export const findDXPathForSpot = (paths = [], spot) => paths.find((path) => matchesDXSpotPath(spot, path));
