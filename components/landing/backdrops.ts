/*
 * Painted backdrops for product shots. Pre-encoded AVIF (desaturated to sit
 * in the monochrome palette) at 1200w and 640w, plus a 24px WebP placeholder
 * inlined so the panel is never blank while the image streams in.
 * Regenerate with sharp: trim 1%, modulate({ saturation: 0.55 }), avif q42.
 */
export type Backdrop = {
  name: string;
  blur: string;
};

export const backdrops = {
  snowfield: {
    name: "snowfield",
    blur: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAABQAwCdASoYABIAPu1qrFEppaSiqAqpMB2JaQDNSBESKHnIgAD+rm9aKzr2vI9NGiK+M7wXEl1TADpwqhcBDqmfKvY2YBGKAAA=",
  },
  lakeRange: {
    name: "lake-range",
    blur: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoYABIAPuVepE2pJSOiMAwBIByJZwAAW82iN5xoGqCiAAD+5xMvtH9tdNrvXCjGRdj4Jpnphk8Mv/3bWQkQnKua2AA=",
  },
  shoreline: {
    name: "shoreline",
    blur: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAwBACdASoYABIAPt1WpU2opKOiN/qoARAbiWkAy2gh37978EKmtUwZUgAA/up5cq32cbjftVhKgcSCam2R2pHJ0zIkkG6+EaKYAA==",
  },
  cove: {
    name: "cove",
    blur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAQBACdASoYABIAPtlapE2oJSOiN/qoAQAbCWcAwNwh34vrmjuzu70EAAD+UNHELavJhFUU+w1kLOIBplFtqHMIA1krDVekODnoHcAA",
  },
} satisfies Record<string, Backdrop>;
