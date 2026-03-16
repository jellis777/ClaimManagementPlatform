import type { Claim } from '../types/claim';

const API_BASE_URL = 'http://localhost:5266/api/claims';

export async function getClaims(): Promise<Claim[]> {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch claims');
  }

  return response.json();
}
