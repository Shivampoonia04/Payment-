import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import WishlistPage from '../../Components/Layouts/WishList/WishList';
import { getWishlistMovies, toggleWishList } from '../../Utils/Api';
import { createTheme } from '@mui/material';

jest.mock('../../Utils/Api', () => ({
  getWishlistMovies: jest.fn(),
  toggleWishList: jest.fn(),
}));

const mockLocalStorage = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4361ee' },
    secondary: { main: '#f50057' },
    background: { default: '#000000', paper: '#000000' },
    text: { primary: '#ffffff', secondary: '#b3b3b3' },
  },
});

const mockMovies = [
  {
    id: 1,
    title: 'Movie 1',
    genre: 'Action',
    release_year: 2020,
    rating: 'PG-13',
    director: 'Sam',
    duration: 120,
    premium: true,
    poster_url: 'https://example.com/poster1.jpg',
  },
  {
    id: 2,
    title: 'Movie 2',
    genre: 'Drama',
    release_year: 2021,
    rating: 'R',
    director: 'Sam',
    duration: 150,
    premium: false,
    poster_url: 'https://example.com/poster2.jpg',
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={darkTheme}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>
  );
};

describe('WishlistPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    (getWishlistMovies as jest.Mock).mockResolvedValueOnce({ movies: [] });
    renderWithProviders(<WishlistPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error state when API call fails', async () => {
    (getWishlistMovies as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    renderWithProviders(<WishlistPage />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load movies')).toBeInTheDocument();
    });
  });

  test('renders empty wishlist message when no movies are present', async () => {
    (getWishlistMovies as jest.Mock).mockResolvedValueOnce({ movies: [] });
    renderWithProviders(<WishlistPage />);
    await waitFor(() => {
      expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
    });
  });

  test('renders movies when API call is successful', async () => {
    (getWishlistMovies as jest.Mock).mockResolvedValueOnce({ movies: mockMovies });
    renderWithProviders(<WishlistPage />);
    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Movie 2')).toBeInTheDocument();
      expect(screen.getByText('ACTION')).toBeInTheDocument();
      expect(screen.getByText('DRAMA')).toBeInTheDocument();
      expect(screen.getByText('PREMIUM')).toBeInTheDocument();
      expect(screen.getByText('120 Min')).toBeInTheDocument();
      expect(screen.getByText('150 Min')).toBeInTheDocument();
      expect(screen.getByText('Sam, 2020')).toBeInTheDocument();
      expect(screen.getByText('Sam, 2021')).toBeInTheDocument();
    });
  });

  test('handles delete button click to remove a movie', async () => {
    (getWishlistMovies as jest.Mock).mockResolvedValueOnce({ movies: mockMovies });
    (toggleWishList as jest.Mock).mockResolvedValueOnce({});
    mockLocalStorage.getItem.mockReturnValue('mock-token');
    renderWithProviders(<WishlistPage />);
    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(toggleWishList).toHaveBeenCalledWith(1, 'mock-token');
      expect(screen.queryByText('Movie 1')).not.toBeInTheDocument();
      expect(screen.getByText('Movie 2')).toBeInTheDocument();
    });
  });

  test('does not call toggleWishList if token is missing', async () => {
    (getWishlistMovies as jest.Mock).mockResolvedValueOnce({ movies: mockMovies });
    mockLocalStorage.getItem.mockReturnValue(null);
    renderWithProviders(<WishlistPage />);
    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(toggleWishList).not.toHaveBeenCalled();
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
    });
  });

  test('navigates to home when back button is clicked', async () => {
    (getWishlistMovies as jest.Mock).mockResolvedValueOnce({ movies: [] });
    renderWithProviders(<WishlistPage />);
    await waitFor(() => {
      expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
    });
    const backButton = screen.getByLabelText('back');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
