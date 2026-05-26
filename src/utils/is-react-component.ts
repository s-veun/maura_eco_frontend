import type { ComponentType } from "react";

type ReactComponentCandidate =
  | ComponentType
  | {
      $$typeof?: symbol;
      render?: unknown;
    };

export function isReactComponent(component: unknown): component is ReactComponentCandidate {
  if (!component) return false;
  if (typeof component === "function") return true;
  if (typeof component === "object") {
    const value = component as { $$typeof?: symbol; render?: unknown };
    return Boolean(value.$$typeof || value.render);
  }
  return false;
}
