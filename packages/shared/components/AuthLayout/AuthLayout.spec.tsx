import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuthLayout } from "./AuthLayout";

describe("AuthLayout", () => {
  it("renders children correctly", () => {
    render(
      <AuthLayout>
        <div data-testid="test-child">Test Content</div>
      </AuthLayout>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders background image", () => {
    render(
      <AuthLayout>
        <div>Test</div>
      </AuthLayout>
    );

    const image = screen.getByAltText("Red car headlight");
    expect(image).toBeInTheDocument();
  });

  it("has correct layout structure", () => {
    const { container } = render(
      <AuthLayout>
        <div>Test</div>
      </AuthLayout>
    );

    // Should have the main container
    const mainBox = container.firstChild;
    expect(mainBox).toBeInTheDocument();
  });
});
