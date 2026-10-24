# Architecture

Syberis is a server-rendered and statically generated Next.js App Router site. Route modules own page composition and metadata; reusable UI modules own interaction and presentation; kennel content is passed from a central data module into those routes.

```mermaid
flowchart TD
  Visitor[Visitor]
  Routes[Next.js App Router<br/>/, /mioty, /rodzice, /galeria, /kontakt]
  LitterRoute[/mioty/[letter]]
  Data[src/data/kennel.js<br/>kennel, parents, litters, puppies]
  Contact[src/lib/contact.js<br/>phone and email links]
  UI[Page modules<br/>Deck, LitterPuppies, ParentsAccordion]
  Motion[Interaction modules<br/>GSAP, Lenis, Three.js]
  Assets[public/<br/>photos, fonts, audio]
  Output[Next.js standalone output]

  Visitor --> Routes
  Routes --> Data
  Routes --> Contact
  Routes --> UI
  LitterRoute --> Data
  UI --> Motion
  UI --> Assets
  Routes --> Output
```

## Module responsibilities

- **`src/app/`** maps URLs to page modules, creates route metadata, and resolves unknown litter slugs with a not-found response.
- **`src/data/kennel.js`** is the content seam for kennel identity, contact details, parent profiles, litter and puppy records, and small lookup/formatting helpers. Route modules consume these exports rather than duplicating records.
- **`src/lib/contact.js`** turns contact values into `tel:` and `mailto:` links.
- **`src/components/`** contains presentation and interaction modules shared by routes. `Deck` presents litter cards; `LitterPuppies` presents a selected puppy; `ParentsAccordion` presents dog profiles; `Showreel`, `Copy`, and `ScrollVideo` provide motion-led sections.
- **`public/`** holds the images, fonts, and audio referenced by the site.

## Rendering and deployment

Litter detail routes are generated from the litter records in `src/data/kennel.js`. Most route content is rendered by the server; modules that need browser APIs or animation opt into client rendering. `next build` produces the standalone server output consumed by the Docker deployment.

## Change and verification path

Edit kennel copy or puppy status in `src/data/kennel.js`; edit route structure in its matching `src/app/` module; edit shared presentation in `src/components/`. Run the automated checks with `npm run format:check`, `npm run lint`, `npm test`, and `npm run build`.
