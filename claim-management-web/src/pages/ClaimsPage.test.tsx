import { renderWithProviders } from '../test/renderWithProviders';
import { screen } from '@testing-library/react';
import ClaimsPage from './ClaimsPage';
import { vi } from 'vitest';
import * as claimService from '../services/claimService';

vi.mock('../services/claimService', () => ({
  getClaims: vi.fn(),
  deleteClaim: vi.fn(),
}));

describe('ClaimsPage', () => {
  it('renders claims from API', async () => {
    vi.mocked(claimService.getClaims).mockResolvedValueOnce([
      {
        id: 1,
        title: 'Broken Window',
        description: 'Window shattered during storm',
        amount: 500,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      },
    ]);

    renderWithProviders(<ClaimsPage />);

    expect(await screen.findByText(/broken window/i)).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  it('shows empty state when no claims exist', async () => {
    vi.mocked(claimService.getClaims).mockResolvedValueOnce([]);

    renderWithProviders(<ClaimsPage />);

    expect(await screen.findByText(/no claims found/i)).toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    vi.mocked(claimService.getClaims).mockRejectedValueOnce(new Error());

    renderWithProviders(<ClaimsPage />);

    expect(
      await screen.findByText(/failed to load claims/i),
    ).toBeInTheDocument();
  });
});
