import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';

export function renderWithProviders(ui: ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>,
  );
}
