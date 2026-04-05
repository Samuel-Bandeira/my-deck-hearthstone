import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/cartas.tsx"),
    route("baralho", "routes/baralho.tsx"),
  ]),
] satisfies RouteConfig;
