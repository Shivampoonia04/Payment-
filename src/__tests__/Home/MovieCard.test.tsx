import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MovieCard from "../../Components/Layouts/Home/MovieCard";
import { Movie, MovieCardProps } from "../../types/Moviecard";

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  rating: 8.5,
  release_year: 2023,
  director: "John Doe",
  poster_url: "https://example.com/poster.jpg",
  premium: false,
};

const defaultProps: MovieCardProps = {
  movie: mockMovie,
  isSupervisor: false,
  cardWidth: 300,
  isXsScreen: false,
  onCardClick: jest.fn(),
  onEditClick: jest.fn(),
  onDeleteClick: jest.fn(),
};

describe("MovieCard Component", () => {
  test("renders movie title, rating, release year, and director", () => {
    render(<MovieCard {...defaultProps} />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("8.5/10")).toBeInTheDocument();
    expect(screen.getByText("Released Year: 2023")).toBeInTheDocument();
    expect(screen.getByText("Director: John Doe")).toBeInTheDocument();
  });
  test("displays premium icon for premium movies", () => {
    const props = {
      ...defaultProps,
      movie: { ...mockMovie, premium: true },
    };
    render(<MovieCard {...props} />);

    expect(screen.getByTestId("WorkspacePremiumIcon")).toBeInTheDocument();
  });

  test("does not display premium icon for non-premium movies", () => {
    render(<MovieCard {...defaultProps} />);

    expect(
      screen.queryByTestId("WorkspacePremiumIcon")
    ).not.toBeInTheDocument();
  });

  test("displays edit and delete buttons when isSupervisor is true", () => {
    const props = {
      ...defaultProps,
      isSupervisor: true,
    };
    render(<MovieCard {...props} />);

    expect(screen.getByTestId("EditIcon")).toBeInTheDocument();
    expect(screen.getByTestId("DeleteIcon")).toBeInTheDocument();
  });

  test("does not display edit and delete buttons when isSupervisor is false", () => {
    render(<MovieCard {...defaultProps} />);

    expect(screen.queryByTestId("EditIcon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("DeleteIcon")).not.toBeInTheDocument();
  });

  test("calls onEditClick with movie object when edit button is clicked", () => {
    const props = {
      ...defaultProps,
      isSupervisor: true,
    };
    render(<MovieCard {...props} />);

    const editButton = screen.getByTestId("EditIcon").parentElement;
    fireEvent.click(editButton!);

    expect(defaultProps.onEditClick).toHaveBeenCalledWith(mockMovie);
  });
});
