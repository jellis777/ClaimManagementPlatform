import type {
  Claim,
  CreateClaimRequest,
  UpdateClaimRequest,
} from '../types/claim';

const API_BASE_URL = 'http://localhost:5266/api/claims';

export async function getClaims(): Promise<Claim[]> {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch claims');
  }

  return response.json();
}

export async function createClaim(payload: CreateClaimRequest): Promise<Claim> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create claim');
  }

  return response.json();
}

export async function updateClaim(
  id: number,
  payload: UpdateClaimRequest,
): Promise<Claim> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update claim');
  }

  return response.json();
}

export async function deleteClaim(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete claim');
  }
}
