import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TourForm from "@/app/components/tours/TourForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the API calls
jest.mock("@/lib/api", () => ({
  createTour: jest.fn(),
  getMarineLife: jest.fn(() =>
    Promise.resolve([
      { id: "1", name: "Dolphin", activeMonths: [1, 2, 3] },
      { id: "2", name: "Whale", activeMonths: [4, 5, 6] },
    ])
  ),
  getLocations: jest.fn(() =>
    Promise.resolve([
      { id: "1", name: "Miami Beach" },
      { id: "2", name: "Key West" },
    ])
  ),
}));

describe("TourForm", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <TourForm />
      </QueryClientProvider>
    );
  });

  it("should submit form with valid data", async () => {
    // Fill in form fields
    await userEvent.type(screen.getByLabelText(/name/i), "Test Tour");
    await userEvent.type(
      screen.getByLabelText(/description/i),
      "Test Description"
    );
    await userEvent.selectOptions(
      screen.getByLabelText(/difficulty/i),
      "MODERATE"
    );
    await userEvent.type(screen.getByLabelText(/duration/i), "4");
    await userEvent.type(screen.getByLabelText(/base price/i), "100");
    await userEvent.type(screen.getByLabelText(/max participants/i), "10");

    // Select locations
    await userEvent.click(screen.getByLabelText(/start location/i));
    await userEvent.click(screen.getByText("Miami Beach"));
    await userEvent.click(screen.getByLabelText(/end location/i));
    await userEvent.click(screen.getByText("Key West"));

    // Select marine life
    await userEvent.click(screen.getByText(/select marine species/i));
    await userEvent.click(screen.getByText("Dolphin"));

    // Submit form
    await userEvent.click(screen.getByRole("button", { name: /create tour/i }));

    // Assert form submission
    await waitFor(() => {
      expect(
        screen.getByText(/tour created successfully/i)
      ).toBeInTheDocument();
    });
  });

  it("should show validation errors for required fields", async () => {
    // Submit empty form
    await userEvent.click(screen.getByRole("button", { name: /create tour/i }));

    // Assert validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/start location is required/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/end location is required/i)).toBeInTheDocument();
    });
  });
});
