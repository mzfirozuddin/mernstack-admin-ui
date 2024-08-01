import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "./login";
// import

describe("Login page", () => {
  it("should render with required fields", () => {
    render(<LoginPage />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Remember me" })
    ).toBeInTheDocument();
    expect(screen.getByText("Forgot password")).toBeInTheDocument();
  });
});

//* NOTE:
//* getBy -> Throws an error
//* findBy -> async
//* queryBy -> same as "getBy" but don't throw any error. If content not found then return "null"
