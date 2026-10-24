# Architecture

Syberis is a server-rendered and statically generated Next.js App Router site. Route modules own URLs and metadata, feature modules own page-specific behavior and presentation, and shared modules provide UI and layout used across features.

```mermaid
flowchart TD
  Visitor[Visitor]
  Routes[Next.js App Router<br/>/, /mioty, /rodzice, /galeria, /kontakt]
  LitterRoute[/mioty/[letter]]
  Data[src/data/kennel.js<br/>kennel, parents, litters, puppies]
  Contact[src/lib/contact.js<br/>phone and email links]
  Features[Features<br/>home, litters, parents, gallery, contact]
  Shared[Shared UI and layout<br/>Button, Copy, Menu, Footer]
  Motion[Interaction modules<br/>GSAP, Lenis, Three.js]
  Assets[public/<br/>photos, fonts, audio]
  Output[Next.js standalone output]

  Visitor --> Routes
  Routes --> Data
  Routes --> Contact
  Routes --> Features
  Features --> Shared
  LitterRoute --> Data
  Features --> Motion
  Features --> Assets
  Routes --> Output
```

## Module responsibilities

- **`src/app/`** maps URLs to route entry points, creates route metadata, and resolves unknown litter slugs with a not-found response. Complex interactive views are delegated to `src/features/`.
- **`src/features/`** groups page behavior by product area: `home`, `litters`, `parents`, `gallery`, and `contact`. Feature-specific styles live beside the code that uses them.
- **`src/shared/ui/`** holds small interface modules used across features, such as `Button` and `Copy`.
- **`src/shared/layout/`** holds site-wide modules such as `Menu`, `Footer`, `Preloader`, and `MusicToggle`.
- **`src/data/kennel.js`** is the content seam for kennel identity, contact details, parent profiles, litter and puppy records, and small lookup/formatting helpers. Route modules consume these exports rather than duplicating records.
- **`src/lib/contact.js`** turns contact values into `tel:` and `mailto:` links.
- **`public/`** holds the images, fonts, and audio referenced by the site.

## Rendering and deployment

Litter detail routes are generated from the litter records in `src/data/kennel.js`. Most route content is rendered by the server; modules that need browser APIs or animation opt into client rendering. `next build` produces the standalone server output consumed by the Docker deployment.

## Change and verification path

Edit kennel copy or puppy status in `src/data/kennel.js`; edit URL and metadata in the matching `src/app/` route; edit page behavior in the corresponding `src/features/` folder; edit site-wide presentation in `src/shared/`. Run the automated checks with `npm run format:check`, `npm run lint`, `npm test`, and `npm run build`.
