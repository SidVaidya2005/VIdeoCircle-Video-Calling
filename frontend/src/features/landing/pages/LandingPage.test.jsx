import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import LandingPage from "./LandingPage";

describe("LandingPage", () => {
  test("renders without crashing inside a router", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
  });

  test("renders at least one of the documented feature cards", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Instant rooms/i)).toBeInTheDocument();
  });
});
