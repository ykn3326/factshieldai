import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { sitemapStaticPaths, sitemapXML } from "@/lib/sitemap";

describe("Public sitemap", () => {
  it("includes public pages without exposing account, report or workflow URLs", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const paths = sitemapStaticPaths(router);
    expect(paths).toEqual(["/about", "/contact", "/home", "/how-it-works", "/privacy", "/terms", "/verify", "/welcome"]);
  });
  it("uses the published origin and omits invented change dates", () => {
    const xml = sitemapXML("https://factshieldai.lovable.app", [{ path: "/home" }]);
    expect(xml).toContain("<loc>https://factshieldai.lovable.app/home</loc>");
    expect(xml).not.toContain("<lastmod>");
  });
});