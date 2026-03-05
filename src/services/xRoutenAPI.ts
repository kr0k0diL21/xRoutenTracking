// src/services/xRoutenAPI.ts
/* const API_KEY = import.meta.env.VITE_XROUTEN_API_KEY; */
const API_URL = import.meta.env.VITE_XROUTEN_API_URL;

// Funktion zum Abrufen des xRoutenData vom Backend
export async function fetchXroutenData() {
  const urlParams = new URLSearchParams(window.location.search);
  const URL_SERVICE_ID = urlParams.get('destination');
  const url = `${API_URL}api/service-locations/${URL_SERVICE_ID}/status`;
  try {
    const response = await fetch(url, {
      method: 'GET',
   /*    headers: {
        Authorization: `ApiKey ${API_KEY}`,
        Accept: 'application/json',
      }, */
    });

    if (!response.ok) {
      throw new Error(`Server sagt Nein(xRouten): ${response.status}`);
    }
    const data = await response.json();
    return await data;
  } catch (error) {
    console.error('Etwas ist schiefgelaufen beim xRoutenFetch:', error);
    throw error;
  }
}
