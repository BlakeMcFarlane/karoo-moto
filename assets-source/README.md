# Source assets

The original, unmodified images supplied for the brand. Nothing here is loaded
by the site — these are the masters that the optimised, shipped versions were
derived from. Keep them so the derivatives can be regenerated at any size.

| File | Derived into |
| --- | --- |
| `logo.PNG` (1273×1236) | `src/assets/rally/logo-badge-720.jpg`, `logo-badge-320.jpg`, and the favicons in `public/` |
| `Backsplash.png` (1717×916, 2.2 MB) | `src/assets/rally/backsplash.jpg` (283 KB) |
| `product picture 1–4.jpeg` | `src/assets/rally/tower-studio-01`, `tower-detail-lights`, `tower-detail-mount`, `tower-detail-plate` |
| `product on bike.jpeg`, `product on bike 2.jpeg` | `src/assets/rally/tower-on-bike-night`, `tower-on-bike-full` |

The badge is square with transparent corners; every use in the site clips it to
a circle (`clip-path: circle(49.5% at 50% 50%)`), and the favicons are generated
pre-clipped.
