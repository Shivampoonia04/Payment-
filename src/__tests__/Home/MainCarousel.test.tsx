import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainCarousel from "../../Components/Layouts/Home/MainCarousel";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@mui/material/useMediaQuery", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const movies = [
  {
    id: 1,
    title: "Movie 1",
    genre: "Action",
    rating: 8,
    release_year: 2020,
    director: "Director 1",
    description: "A thrilling action movie.",
    poster_url: "http://example.com/poster1.jpg",
    banner_url: "http://example.com/banner1.jpg",
    premium: true,
  },
  {
    id: 2,
    title: "Movie 2",
    genre: "Drama",
    rating: 7,
    release_year: 2021,
    director: "Director 2",
    description: "An emotional drama.",
    poster_url: "http://example.com/poster2.jpg",
    banner_url: "http://example.com/banner2.jpg",
    premium: false,
  },
];

const theme = createTheme();

describe("MainCarousel Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const useMediaQuery = require("@mui/material/useMediaQuery").default;
    useMediaQuery.mockImplementation(
      (query: string | ((theme: any) => string)) => {
        if (query === theme.breakpoints.down("sm")) return false;
        if (query === theme.breakpoints.between("sm", "md")) return false;
        return true;
      }
    );
  });

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <MainCarousel movies={movies} {...props} />
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  test("renders 'No movies available' when movies array is empty", () => {
    renderComponent({ movies: [] });
    expect(screen.getByText("No movies available.")).toBeInTheDocument();
  });

  test("renders current movie details", () => {
    renderComponent();
    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Genre: Action")).toBeInTheDocument();
    expect(screen.getByText("Year: 2020")).toBeInTheDocument();
    expect(screen.getByText("Rating: 8/10")).toBeInTheDocument();
    expect(screen.getByText("A thrilling action movie.")).toBeInTheDocument();
  });

  test("renders streaming service badges", () => {
    renderComponent();
    expect(screen.getByText("NETFLIX")).toBeInTheDocument();
    expect(screen.getByText("DISNEY+")).toBeInTheDocument();
    expect(screen.getByText("prime video")).toBeInTheDocument();
    expect(screen.getByText("Vidio")).toBeInTheDocument();
    expect(screen.getByText("Apple TV+")).toBeInTheDocument();
    expect(screen.getByText("viu")).toBeInTheDocument();
  });

  test("navigates to movie details on 'More Info' button click", () => {
    renderComponent();
    fireEvent.click(screen.getByText("More Info"));
    expect(mockNavigate).toHaveBeenCalledWith("/movie/1");
  });

  test("renders navigation buttons on non-mobile screens", () => {
    renderComponent();
    expect(screen.getByLabelText(/previous-slide/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/next-slide/i)).toBeInTheDocument();
  });

  test("renders pagination dots on mobile screens", () => {
    const useMediaQuery = require("@mui/material/useMediaQuery").default;
    useMediaQuery.mockImplementation(
      (query: string | ((theme: any) => string)) => {
        if (query === theme.breakpoints.down("sm")) return true;
        return false;
      }
    );
    renderComponent();
    expect(screen.getAllByTestId(/pagination-dot-/i)).toHaveLength(
      movies.length
    );
  });

  test("changes slide on next button click", () => {
    renderComponent();
    fireEvent.click(screen.getByLabelText(/next-slide/i));
    expect(screen.getByText("Movie 2")).toBeInTheDocument();
  });

  test("changes slide on previous button click", () => {
    renderComponent();
    fireEvent.click(screen.getByLabelText(/previous-slide/i));
    expect(screen.getByText("Movie 2")).toBeInTheDocument();
  });

  test("changes slide on pagination dot click", () => {
    const useMediaQuery = require("@mui/material/useMediaQuery").default;
    useMediaQuery.mockImplementation(
      (query: string | ((theme: any) => string)) => {
        if (query === theme.breakpoints.down("sm")) return true;
        return false;
      }
    );
    renderComponent();
    const dots = screen.getAllByTestId(/pagination-dot-/i);
    fireEvent.click(dots[1]);
    expect(screen.getByText("Movie 2")).toBeInTheDocument();
  });

  test("auto-rotates slides every 5 seconds", async () => {
    jest.useFakeTimers();
    renderComponent();
    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    jest.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(screen.getByText("Movie 2")).toBeInTheDocument();
    });
    jest.useRealTimers();
  });

  test("renders movie poster in CardMedia", () => {
    renderComponent();
    const poster = screen.getByAltText("Movie 1");
    expect(poster).toHaveAttribute("src", "http://example.com/banner1.jpg");
  });

  test("handles missing description gracefully", () => {
    const moviesNoDesc = [
      {
        ...movies[0],
        description: undefined,
      },
    ];
    renderComponent({ movies: moviesNoDesc });
    expect(screen.getByText("No description available.")).toBeInTheDocument();
  });
});
