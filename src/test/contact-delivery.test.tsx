import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import en from "@/i18n/en";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: { component: () => unknown }) => ({ options }),
  Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));
vi.mock("@/components/layout/SiteLayout", () => ({
  SiteLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PageHeader: () => null,
}));
vi.mock("@/components/auth/AuthShell", () => ({ FieldError: () => null }));
vi.mock("@/context/LanguageContext", () => ({ useTranslation: () => ({ t: en }) }));

import { Route } from "@/routes/contact";

describe("Contact delivery safeguards", () => {
  it("cannot report success or discard entries when no delivery service is connected", async () => {
    const Contact = Route.options.component;
    if (!Contact) throw new Error("Contact page is missing");
    const { container } = render(<Contact />);
    fireEvent.change(screen.getByLabelText(en.contact.name), { target: { value: "Test Visitor" } });
    fireEvent.change(screen.getByLabelText(en.contact.email), { target: { value: "visitor@example.org" } });
    fireEvent.change(screen.getByLabelText(en.contact.subject), { target: { value: "Feedback" } });
    const message = screen.getByLabelText(en.contact.message);
    fireEvent.change(message, { target: { value: "Please explain your evidence sources." } });
    expect(screen.getByRole("button", { name: en.contact.send })).toBeDisabled();
    const form = container.querySelector("form");
    if (!form) throw new Error("Contact form is missing");
    fireEvent.submit(form);
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(message).toHaveValue("Please explain your evidence sources.");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});