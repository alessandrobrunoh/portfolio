import type { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", loadComponent: () => import("./home.component").then((m) => m.HomeComponent) },
  { path: "projects/:id", loadComponent: () => import("./project-page.component").then((m) => m.ProjectPageComponent) },
  { path: "blog/:slug", loadComponent: () => import("./blog-post.component").then((m) => m.BlogPostComponent) },
];
