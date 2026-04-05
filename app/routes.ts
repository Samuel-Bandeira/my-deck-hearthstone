import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/cards.tsx"),
    route("deck", "routes/deck.tsx"),
  ]),
] satisfies RouteConfig;
