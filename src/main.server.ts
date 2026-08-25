import { bootstrapApplication } from "@angular/platform-browser";
import { provideServerRendering } from "@angular/ssr";
import { AppComponent } from "./app/app.component";

export default () => bootstrapApplication(AppComponent, { providers: [provideServerRendering()] });
