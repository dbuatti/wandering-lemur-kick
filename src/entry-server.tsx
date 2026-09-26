// Build-time render of the public home page (see scripts/prerender.mjs), so
// search engines and link previews get real HTML instead of an empty <div>.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppProviders, AppRoutes, createQueryClient } from "./App";

export { site } from "./content/site";
export { tiers, faqs } from "./content/services";

export function render(url: string) {
  return renderToString(
    <AppProviders client={createQueryClient()}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>,
  );
}
