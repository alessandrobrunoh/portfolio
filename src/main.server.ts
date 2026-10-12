import { mergeApplicationConfig } from "@angular/core";
import { bootstrapApplication, type BootstrapContext } from "@angular/platform-browser";
import { renderApplication } from "@angular/platform-server";
import { provideServerRendering } from "@angular/ssr";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

const config = mergeApplicationConfig(appConfig, { providers: [provideServerRendering()] });

/** Analog calls this at build time for every prerendered route (vite.config.ts) and writes the HTML to disk. */
export default function render(url: string, document: string) {
  return renderApplication((context: BootstrapContext) => bootstrapApplication(AppComponent, config, context), { document, url });
}
