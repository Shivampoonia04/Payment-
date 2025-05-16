import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovieDetails from "../../Components/Layouts/Movie/MovieDetails";
import { toggleWishList } from "../../Utils/Api";

jest.mock("../../Utils/Api", () => ({
  toggleWishList: jest.fn(),
}));

const mockLocalStorage = {
  getItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

const mockMovie = {
  id: 1,
  title: "Fight Club",
  banner_url: "https://example.com/fightclub.jpg",
  director: "David Fincher",
  rating: 8.8,
  genre: "Drama",
  release_year: 1999,
  description:
    "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
  duration: 139,
  inWatchlist: false,
};

describe("MovieDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue("mock-token");
  });

  test("renders movie details correctly", () => {
    render(<MovieDetails movie={mockMovie} />);

    expect(screen.getByText("Fight Club")).toBeInTheDocument();
    expect(screen.getByText("Directed by: David Fincher")).toBeInTheDocument();
    expect(screen.getByText(mockMovie.description)).toBeInTheDocument();
    expect(screen.getByText("Brad Pitt")).toBeInTheDocument();
    expect(screen.getByText("Edward Norton")).toBeInTheDocument();
    expect(screen.getByText("Helena Bonham Carter")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      mockMovie.banner_url
    );
  });

  test("renders fallback message when no movie data is provided", () => {
    render(<MovieDetails movie={null} />);
    expect(screen.getByText("No movie data available.")).toBeInTheDocument();
  });

  test("adds movie to watchlist when button is clicked", async () => {
    (toggleWishList as jest.Mock).mockResolvedValue({});
    render(<MovieDetails movie={mockMovie} />);

    const button = screen.getByRole("button", { name: /Add to Watchlist/i });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    await waitFor(() => {
      expect(toggleWishList).toHaveBeenCalledWith(mockMovie.id, "mock-token");
      expect(
        screen.getByRole("button", { name: /Remove from Watchlist/i })
      ).toBeInTheDocument();
    });
  });

  test("removes movie from watchlist when button is clicked", async () => {
    (toggleWishList as jest.Mock).mockResolvedValue({});
    const movieInWatchlist = { ...mockMovie, inWatchlist: true };
    render(<MovieDetails movie={movieInWatchlist} />);

    const button = screen.getByRole("button", {
      name: /Remove from Watchlist/i,
    });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    await waitFor(() => {
      expect(toggleWishList).toHaveBeenCalledWith(mockMovie.id, "mock-token");
      expect(
        screen.getByRole("button", { name: /Add to Watchlist/i })
      ).toBeInTheDocument();
    });
  });

  test("does not call toggleWishList if no token is present", async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    render(<MovieDetails movie={mockMovie} />);

    const button = screen.getByRole("button", { name: /Add to Watchlist/i });
    await userEvent.click(button);

    expect(toggleWishList).not.toHaveBeenCalled();
  });

  test("displays loading state when toggling watchlist", async () => {
    (toggleWishList as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<MovieDetails movie={mockMovie} />);

    const button = screen.getByRole("button", { name: /Add to Watchlist/i });
    await userEvent.click(button);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });

  test("handles error when toggling watchlist fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (toggleWishList as jest.Mock).mockRejectedValue(new Error("API Error"));
    render(<MovieDetails movie={mockMovie} />);

    const button = screen.getByRole("button", { name: /Add to Watchlist/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(toggleWishList).toHaveBeenCalledWith(mockMovie.id, "mock-token");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error toggling wishlist:",
        expect.any(Error)
      );
      expect(button).toHaveTextContent("Add to Watchlist"); // State doesn't change on error
    });

    consoleErrorSpy.mockRestore();
  });
});
