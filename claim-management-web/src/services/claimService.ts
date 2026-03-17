import type {
  Claim,
  CreateClaimRequest,
  UpdateClaimRequest,
} from '../types/claim';

const API_BASE_URL = 'http://localhost:5266/api/claims';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export async function getClaims(): Promise<Claim[]> {
  const response = await fetch(API_BASE_URL, { headers: getAuthHeaders() });

  if (!response.ok) {
    throw new Error('Failed to fetch claims');
  }

  return response.json();
}

export async function createClaim(payload: CreateClaimRequest): Promise<Claim> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete claim');
  }
}
