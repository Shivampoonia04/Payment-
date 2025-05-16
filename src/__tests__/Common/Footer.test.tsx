import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Footer from "../../Components/Common/Footer";

const renderWithTheme = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("Footer Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders MovieExplorer branding and description", () => {
    renderWithTheme(<Footer />);

    expect(screen.getByText("MovieExplorer")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Discover movies, explore trending trailers, and find what to watch next."
      )
    ).toBeInTheDocument();
  });

  test("renders Quick Links section with correct links", () => {
    renderWithTheme(<Footer />);

    expect(screen.getByText("Quick Links")).toBeInTheDocument();

    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");

    const genreLink = screen.getByText("Genre").closest("a");
    expect(genreLink).toHaveAttribute("href", "/movies");

    const subscriptionLink = screen.getByText("Subscription").closest("a");
    expect(subscriptionLink).toHaveAttribute("href", "/subscription");

    const wishlistLink = screen.getByText("WishList").closest("a");
    expect(wishlistLink).toHaveAttribute("href", "/wishlist");
  });
  test("renders copyright notice with current year", () => {
    renderWithTheme(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} MovieExplorer. All rights reserved.`)
    ).toBeInTheDocument();
  });

  test("renders divider between content and copyright", () => {
    renderWithTheme(<Footer />);

    const divider = screen.getByRole("separator");
    expect(divider).toBeInTheDocument();
  });
});
