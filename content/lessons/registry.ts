import type { ComponentType } from "react";

/**
 * Registry of authored lessons.
 *
 * Each entry maps a "phaseId/moduleId/slug" key to a dynamically loaded
 * React component that renders the full five-layer lesson.
 *
 * Lessons NOT in this registry render a "Coming Soon" placeholder.
 */

type LessonModule = { default: ComponentType };

type Loader = () => Promise<LessonModule>;

export const lessonRegistry: Record<string, Loader> = {
  // ── Phase 0, Module 0.1 — The Machine
  "0/0-1/what-a-computer-does":      () => import("./phase-0/module-0-1/01-what-a-computer-does"),
  "0/0-1/operating-systems":         () => import("./phase-0/module-0-1/02-operating-systems"),
  "0/0-1/the-filesystem":            () => import("./phase-0/module-0-1/03-the-filesystem"),
  "0/0-1/how-programs-run":          () => import("./phase-0/module-0-1/04-how-programs-run"),
  "0/0-1/processes-memory-crashes":  () => import("./phase-0/module-0-1/05-processes-memory-crashes"),

  // ── Phase 0, Module 0.2 — The Terminal
  "0/0-2/what-the-terminal-is":      () => import("./phase-0/module-0-2/06-what-the-terminal-is"),
  "0/0-2/navigating-via-terminal":   () => import("./phase-0/module-0-2/07-navigating-via-terminal"),
  "0/0-2/reading-writing-files":     () => import("./phase-0/module-0-2/08-reading-writing-files"),
  "0/0-2/environment-variables":     () => import("./phase-0/module-0-2/09-environment-variables"),
  "0/0-2/the-path":                  () => import("./phase-0/module-0-2/10-the-path"),
  "0/0-2/permissions":               () => import("./phase-0/module-0-2/11-permissions"),
  "0/0-2/piping-and-redirection":    () => import("./phase-0/module-0-2/12-piping-and-redirection"),

  // ── Phase 0, Module 0.3 — How the Internet Works
  "0/0-3/url-to-page":               () => import("./phase-0/module-0-3/13-url-to-page"),
  "0/0-3/ip-dns-domains":            () => import("./phase-0/module-0-3/14-ip-dns-domains"),
  "0/0-3/http-https":                () => import("./phase-0/module-0-3/15-http-https"),
  "0/0-3/what-an-api-is":            () => import("./phase-0/module-0-3/16-what-an-api-is"),
  "0/0-3/status-codes":              () => import("./phase-0/module-0-3/17-status-codes"),
  "0/0-3/server-vs-client":          () => import("./phase-0/module-0-3/18-server-vs-client"),
  "0/0-3/localhost":                 () => import("./phase-0/module-0-3/19-localhost"),

  // ── Phase 0, Module 0.4 — Project Anatomy
  "0/0-4/what-a-project-is":         () => import("./phase-0/module-0-4/20-what-a-project-is"),
  "0/0-4/common-files":              () => import("./phase-0/module-0-4/21-common-files"),
  "0/0-4/what-dependencies-are":     () => import("./phase-0/module-0-4/22-what-dependencies-are"),
  "0/0-4/what-a-build-is":           () => import("./phase-0/module-0-4/23-what-a-build-is"),
  "0/0-4/dev-staging-production":    () => import("./phase-0/module-0-4/24-dev-staging-production"),
};

export function lessonKey(phaseId: string, moduleId: string, slug: string) {
  return `${phaseId}/${moduleId}/${slug}`;
}

export function hasLesson(phaseId: string, moduleId: string, slug: string) {
  return !!lessonRegistry[lessonKey(phaseId, moduleId, slug)];
}
