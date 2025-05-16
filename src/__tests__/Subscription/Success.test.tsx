import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Success from '../../Components/Layouts/Subscription/Success'; // Adjust path as needed
import * as api from '../../Utils/Api'; // Mock the `success` API

jest.mock('../../Utils/Api', () => ({
  success: jest.fn(),
}));

describe('Success Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/success?session_id=test123']}>
        <Routes>
          <Route path="/success" element={<Success />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/verifying your subscription/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders success state with subscription details', async () => {
    (api.success as jest.Mock).mockResolvedValueOnce({
      plan_name: 'Premium Plan',
    });

    render(
      <MemoryRouter initialEntries={['/success?session_id=test123']}>
        <Routes>
          <Route path="/success" element={<Success />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/subscription activated/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/Enjoy your Premium Plan/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Exploring Movies/i })).toBeInTheDocument();
  });

  test('renders error when session_id is missing', async () => {
    render(
      <MemoryRouter initialEntries={['/success']}>
        <Routes>
          <Route path="/success" element={<Success />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/subscription error/i)).toBeInTheDocument());

    expect(screen.getByText(/no session ID found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });

  test('renders error on API failure', async () => {
    (api.success as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    render(
      <MemoryRouter initialEntries={['/success?session_id=test123']}>
        <Routes>
          <Route path="/success" element={<Success />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/subscription error/i)).toBeInTheDocument());
    expect(screen.getByText(/API failed/i)).toBeInTheDocument();
  });
});
