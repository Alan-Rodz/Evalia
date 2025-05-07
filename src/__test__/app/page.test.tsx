import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import HomePage from '../../app/page';

// ********************************************************************************
describe('Home form validation', () => {
 it('should show validation error when submitting without a description', async () => {
  render(<HomePage />);

  const button = screen.getByRole('button', { name: /generate ranking/i });
  fireEvent.click(button);

  await waitFor(() => { expect(screen.getByText(/the string is required/i)).toBeInTheDocument(); });
 });
});
