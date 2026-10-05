import type { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", loadComponent: () => import("./home.component").then((m) => m.HomeComponent) },
  { path: "projects/:id", loadComponent: () => import("./project-page.component").then((m) => m.ProjectPageComponent) },
  { path: "brand", loadComponent: () => import("./brand-page.component").then((m) => m.BrandPageComponent) },
  // Articles now live inside their project or case page; old links land on the home page.
  { path: "blog/:slug", redirectTo: "" },
  { path: "work/:id", loadComponent: () => import("./case-study-page.component").then((m) => m.CaseStudyPageComponent) },
  { path: "**", redirectTo: "" },
];
