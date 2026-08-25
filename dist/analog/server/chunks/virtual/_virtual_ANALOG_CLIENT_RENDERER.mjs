import { e as eventHandler } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

// ROLLUP_NO_REPLACE 
 const template = "<!doctype html>\n<html lang=\"en\" class=\"antialiased\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <title>Alessandro Bruno</title>\n    <meta\n      name=\"description\"\n      content=\"Junior full-stack developer. Event-driven systems in Rust, open source, and a thesis on real-time telemetry.\"\n    />\n    <meta name=\"theme-color\" content=\"#eceef4\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n    <link\n      rel=\"stylesheet\"\n      href=\"https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,400&display=swap\"\n    />\n    <script>\n      (function () {\n        try {\n          if (localStorage.getItem(\"theme\") === \"dark\") document.documentElement.classList.add(\"dark\");\n        } catch (e) {}\n      })();\n    </script>\n    <script type=\"module\" crossorigin src=\"/assets/index-Cggsv8xo.js\"></script>\n    <link rel=\"modulepreload\" crossorigin href=\"/assets/_router-chunk-CxvS7D3w.js\">\n    <link rel=\"stylesheet\" crossorigin href=\"/assets/index-DCzG0ASA.css\">\n  </head>\n  <body>\n    <app-root></app-root>\n  </body>\n</html>\n";

const _virtual__ANALOG_CLIENT_RENDERER = eventHandler(async () => {
  return template;
});

export { _virtual__ANALOG_CLIENT_RENDERER as default };
//# sourceMappingURL=_virtual_ANALOG_CLIENT_RENDERER.mjs.map
