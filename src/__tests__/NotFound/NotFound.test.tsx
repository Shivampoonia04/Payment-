import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "../../Components/Layouts/NotFound/NotFound";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("NotFound Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders 404 - Page Not Found text", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
  });

  test("renders error message", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Oops! The page you're looking for doesn't exist.")
    ).toBeInTheDocument();
  });

  test("renders Go to Home button", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /go to home/i });
    expect(button).toBeInTheDocument();
  });

  test("navigates to home when button is clicked", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /go to home/i });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
