// src/services/xRoutenAPI.ts
/* const API_KEY = import.meta.env.VITE_XROUTEN_API_KEY; */
const API_URL = import.meta.env.VITE_XROUTEN_API_URL;

// Funktion zum Abrufen des xRoutenData vom Backend
export async function fetchXroutenData() {
  const destinationId = getDestinationId(window.location.search);

  if (!destinationId) {
    throw new Error('MISSING_DESTINATION_ID');
  }

  if (!isValidUUID(destinationId)) {
    throw new Error('INVALID_UUID');
  }
  const url = `${API_URL}api/service-locations/${destinationId}/status`;
   /* const url = `/api-xrouten/api/service-locations/${destinationId}/status`; */
  try {
    const response = await fetch(url, {
    /*   method: 'GET',
        headers: {
        Authorization: `ApiKey ${API_KEY}`,
        Accept: 'application/json',
      }, */
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NOT_FOUND');
      }
      throw new Error(`SERVER_ERROR_${response.status}`);
    }
    const data = await response.json();
    return await data;
  } catch (error) {
    console.error('Etwas ist schiefgelaufen beim xRoutenFetch:', error);
    throw error;
  }
}

function isValidUUID(uuid: string | null): uuid is string {
  if (!uuid) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
export function getDestinationId(search: string): string | null {
  const urlParams = new URLSearchParams(search);
  return urlParams.get('destination');
}
