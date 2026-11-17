# Backend integration plan

How this frontend will talk to the future backend. **Nothing in this document is built yet** except the frontend pieces listed under "What exists today". The endpoint list and JSON shapes are a proposal for the Spring Boot project to confirm, not a finished contract.

## The boundary

```
Browser
   │  HTTPS, one public origin
   ▼
Reverse proxy ──  /        ──▶  Frontend (this Astro project)
              └─  /api/*   ──▶  Spring Boot REST API ──▶ PostgreSQL (private)
```

| Frontend (this repository)                     | Backend (separate Spring Boot project)                 |
| ---------------------------------------------- | ------------------------------------------------------ |
| Pages, components, styling, interaction        | Business rules and validation                          |
| Calls REST endpoints, renders the JSON it gets | Authentication and authorization (Spring Security)     |
| Form checks that help the visitor              | The checks that actually protect data                  |
| No secrets, no database access, no Java        | Database access, image storage, rate limiting, logging |

The two projects share only the HTTP contract. Either can be rebuilt or redeployed without the other.

## What exists today

| Concern                    | Where                                   | State                                                    |
| -------------------------- | --------------------------------------- | -------------------------------------------------------- |
| Product and category types | `src/types/product.ts`                  | Plain JSON-compatible shapes (`null` for missing values) |
| Data-access interface      | `src/lib/products/productRepository.ts` | `ProductRepository`, all methods async                   |
| Current data source        | `src/lib/products/localProducts.ts`     | Reads the local demo records in `src/data/products.ts`   |
| Network calls              | `src/lib/api/`                          | One module so far: `inquiries.ts` (contact form)         |
| UI components              | `src/components/**`                     | Receive typed props only; none fetch data                |

The rule that keeps this clean: **`fetch()` appears only inside `src/lib/api/`.** Components and `src/scripts/` call functions from there.

## Switching inventory to the API

No component or page markup changes. Three steps, all in `src/lib/`:

1. **Add a small shared client**, `src/lib/api/client.ts`: one function that prefixes the base URL, sets JSON headers, sends cookies when needed, and turns non-2xx responses into a typed error. Create it at this point, when there is a second caller, and have `inquiries.ts` use it too.

2. **Add feature modules** that return the frontend types:

   ```ts
   // src/lib/api/products.ts
   import { apiGet } from './client';
   import type { Product } from '@/types/product';

   export const fetchProducts = () => apiGet<Product[]>('/products');
   export const fetchProduct = (slug: string) => apiGet<Product>(`/products/${slug}`);
   ```

   If the API's JSON ever differs from the frontend types, map it here, in one place, rather than changing components.

3. **Add an API-backed repository** and select it:

   ```ts
   // src/lib/products/apiProducts.ts
   export const apiProductRepository: ProductRepository = {
     listProducts: () => fetchProducts(),
     findProductBySlug: (slug) => fetchProduct(slug),
     // …
   };

   // src/lib/products/productRepository.ts
   export const productRepository: ProductRepository = apiProductRepository;
   ```

The base URL comes from an environment variable (for example `API_BASE_URL`), never from source code. With the unified origin above, browser-side calls simply use the relative path `/api`.

## Proposed REST contract

Public, no authentication:

| Method | Path                   | Purpose                                                   |
| ------ | ---------------------- | --------------------------------------------------------- |
| GET    | `/api/products`        | Published products. Optional `?category=`, `?featured=`   |
| GET    | `/api/products/{slug}` | One product                                               |
| GET    | `/api/categories`      | Categories                                                |
| GET    | `/api/business`        | Published business information                            |
| POST   | `/api/inquiries`       | Contact inquiry. Validated and rate-limited by the server |

Administrators only, enforced by Spring Security on every request:

| Method      | Path                                        | Purpose                                  |
| ----------- | ------------------------------------------- | ---------------------------------------- |
| POST        | `/api/admin/products`                       | Create a product                         |
| PUT / PATCH | `/api/admin/products/{id}`                  | Update, including price and availability |
| DELETE      | `/api/admin/products/{id}`                  | Delete or archive                        |
| POST        | `/api/admin/products/{id}/images`           | Upload an image                          |
| DELETE      | `/api/admin/products/{id}/images/{imageId}` | Remove an image                          |
| PUT / PATCH | `/api/admin/business`                       | Change business information              |

Public reads address a product by `slug` (it is in the page URL); admin writes address it by stable `id`.

### Product JSON

This is exactly the frontend `Product` type, so a response in this shape needs no mapping. The backend should return it from a DTO, not directly from a database entity.

```json
{
  "id": "8f3c2a1e",
  "slug": "example-lever-action-rifle",
  "name": "Example Lever-Action Rifle",
  "manufacturer": "Maker",
  "model": "Model 94",
  "category": { "id": "rifles", "label": "Rifles", "singular": "Rifle" },
  "condition": "used",
  "availability": "available",
  "price": 1249.99,
  "description": "Short factual description.",
  "specs": [{ "label": "Caliber", "value": ".30-30" }],
  "images": [
    { "src": "/api/media/products/8f3c2a1e/1.jpg", "alt": "Right side", "label": "Full view" }
  ],
  "featured": true,
  "isDemo": false
}
```

Fixed vocabularies, shared by both sides:

- `condition`: `new` | `used`
- `availability`: `available` | `confirm` | `sold`
- `price`: US dollars as a number, or `null` for "Call for price"
- `model`, `description`, `specs[].value`: `null` when not supplied
- `images[].src`: a URL. (Locally imported image assets are also accepted by the frontend, for content that ships with the site.)

`isDemo` exists for the demonstration data; a live API would always send `false` or the field can be dropped from the type once demo records are gone.

Error responses should use one consistent JSON shape across the API (Spring's RFC 9457 "problem details" support is a reasonable default) so the shared client can handle them uniformly.

## Rendering: when the data is fetched

The repository abstraction works the same in each case; only where the code runs changes.

| Approach                  | How                                                           | Trade-off                                                                 |
| ------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Build time (today)        | Pages call the repository during `astro build`                | Fastest pages, best for search engines; inventory changes need a rebuild  |
| On request, on the server | Add Astro's Node adapter; inventory routes render per request | Always current, still fully rendered HTML; frontend container runs Node   |
| In the browser            | A script calls `lib/api` after the page loads                 | Needs loading, error and empty states; content is not in the initial HTML |

Suggested starting point once the API exists: keep the marketing pages static and render the inventory routes on request, with the frontend container calling the API over the private Docker network. Price and availability then stay current without rebuilds, and product pages remain indexable. Browser-side fetching is best kept for things that only make sense live, and an admin interface.

## Security responsibilities

Enforced by Spring Boot, never by the frontend:

- Authentication for administrators and role or permission checks on every admin endpoint. A hidden button is not a control.
- Validation of every request body, including the public inquiry endpoint.
- Rate limiting on inquiries and login.
- Server-managed sessions with `Secure`, `HttpOnly`, `SameSite` cookies; CSRF protection for cookie-authenticated writes.
- CORS left closed. With one public origin and `/api/*` proxied, cross-origin access is not needed.
- HTTPS at the reverse proxy; logging and error handling that do not leak internals.

Rules the frontend follows:

- No database credentials, API secrets or admin tokens in frontend code or in any `PUBLIC_` environment variable (those are shipped to browsers).
- Nothing long-lived in `localStorage`; the admin session lives in the cookie the server sets.
- When admin screens are added, their requests go through the shared client with `credentials: 'include'` and the CSRF token header Spring Security expects.
- Form validation in `src/scripts/contactForm.ts` is for the visitor's convenience only.

## Deployment sketch (not implemented)

Four containers on Unraid, on a private Docker network:

- **Reverse proxy** — the only container with published ports; terminates HTTPS; routes `/api/*` to the API and everything else to the frontend.
- **Frontend** — this project (static files, or the Node server if on-request rendering is used).
- **API** — Spring Boot.
- **PostgreSQL** — no published port; reachable only by the API; data on a persistent volume.

Configuration and secrets are supplied through environment variables or Docker secrets, not committed files.

## Open decisions for the backend phase

- Where the admin interface lives: a protected area of this frontend, or a separate small app.
- Where product images are stored and how they are resized.
- Whether inventory pages render on request or the API triggers a frontend rebuild after changes.
