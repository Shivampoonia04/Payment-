import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SubscriptionPlans from '../../Components/Layouts/Subscription/SubscriptionPlans';
import * as api from '../../Utils/Api';

jest.mock('../../Utils/Api', () => ({
  createSubscription: jest.fn(),
}));

describe('SubscriptionPlans Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all subscription plans', () => {
    render(<SubscriptionPlans />);
    expect(screen.getByText(/1 Day Pass/i)).toBeInTheDocument();
    expect(screen.getByText(/30 Day Pass/i)).toBeInTheDocument();
    expect(screen.getByText(/3 Month Premium/i)).toBeInTheDocument();
  });

  test('selecting a plan updates the UI', () => {
    render(<SubscriptionPlans />);
    const selectButtons = screen.getAllByRole('button', { name: /Select Plan/i });
    fireEvent.click(selectButtons[0]);
    expect(selectButtons[0]).toHaveTextContent(/Selected/i);
  });

  test('displays confirmation section upon plan selection', () => {
    render(<SubscriptionPlans />);
    const selectButtons = screen.getAllByRole('button', { name: /Select Plan/i });
    fireEvent.click(selectButtons[1]);
    expect(screen.getByText(/Confirm Your Subscription/i)).toBeInTheDocument();
  });

  test('does not display confirmation section when no plan is selected', () => {
    render(<SubscriptionPlans />);
    expect(screen.queryByText(/Confirm Your Subscription/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Subscribe Now/i })).not.toBeInTheDocument();
  });

  test('initiates subscription process upon confirmation', async () => {
    const mockUrl = 'https://checkout.example.com';
    (api.createSubscription as jest.Mock).mockResolvedValue(mockUrl);
    delete (window as any).location;
    (window as any).location = { href: '' };

    render(<SubscriptionPlans />);
    const selectButtons = screen.getAllByRole('button', { name: /Select Plan/i });
    fireEvent.click(selectButtons[1]);

    const subscribeButton = screen.getByRole('button', { name: /Subscribe Now/i });
    fireEvent.click(subscribeButton);
    await waitFor(() => {
      expect(api.createSubscription).toHaveBeenCalledWith('1-month');
      expect(window.location.href).toBe(mockUrl);
    });
  });

  test('displays error message when subscription API fails', async () => {
    (api.createSubscription as jest.Mock).mockRejectedValue(new Error('Failed to initiate subscription'));
    
    render(<SubscriptionPlans />);
    const selectButtons = screen.getAllByRole('button', { name: /Select Plan/i });
    fireEvent.click(selectButtons[1]);

    const subscribeButton = screen.getByRole('button', { name: /Subscribe Now/i });
    fireEvent.click(subscribeButton);
    await waitFor(() => {
      expect(screen.getByText(/Failed to initiate subscription/i)).toBeInTheDocument();
    });
  });
});