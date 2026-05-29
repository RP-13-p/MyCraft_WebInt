# MyCraft

Raphael Partouche || Vincent Berardi || Razi Bouallagui

----------

### Step 1

Created the main `index.html` dashboard and the settings page.
Set up `style.css` and `app.js` with the sidebar, navbar and base colors.

### Step 2

Added Quotes and Invoices pages. Both have a form and a data table.
Updated `style.css` for inner page styles. Fixed sidebar links.

### Step 3

Redesigned Quotes, Invoices and Clients pages to match wireframes.
Pages now show summary cards and pull data from localStorage instead of static HTML.
Moved creation forms to dedicated pages (`new_quote.html`, `new_invoice.html`, `new_client.html`).
Moved all JS into a `js/` folder.

### Step 4

Added Catalogue page (`catalog.html`) and `new_catalog.html`.
Replaced the navbar text with the project logo (`images/Logo.png`, generated with GPT).
Wired up dashboard action buttons to their creation pages.

### Step 6

Linked quotes, catalog and invoices together.
Client and catalog dropdowns auto-fill form fields. Cost and profit are tracked per line.
Changing a quote status to "Validé" automatically creates the matching invoice.

### Step 7

Translated the UI to French. Only visible text was changed — no JS, ids or class names.

### Step 8

Wrapped all data-entry pages in proper `<form>` elements with `required` attributes.
Save buttons are now `type="submit"`, cancel buttons stay `type="button"`.

### Step 9

Added address geocoding to the client form using Nominatim (OpenStreetMap, no API key).
A Leaflet map appears below the form when an address is matched, with a debounce of 800ms.
Coordinates are saved with the client in localStorage.

### Step 10

Dashboard now reads real data from localStorage instead of hardcoded values.
Revenue = paid invoices this month, profit = sum of invoice profits, interventions = invoice count.

### Step 11

Added catalog picker to the invoice form. Both forms pre-fill today's date.
Quotes show an expiry date (date + validity days), expired ones highlighted in red.
Invoices show a due date (date + 30 days), overdue ones highlighted in red.

### Step 12

Made the layout responsive with CSS media queries.
Tablet (≤ 1024px): card grids go from 4 to 2 columns.
Mobile (≤ 600px): single column, sidebar overlay, forms stack vertically.
For tables on mobile, on LLM advice (see `AI_prompt.txt` #8) we used the stacked card pattern
instead of horizontal scroll: each row becomes a block with labeled fields via `data-label` + `::before`.

### Step 13

Fixed dashboard layout and metrics accuracy.

Layout: `body` is now a flex column (`height: 100%`, `overflow: hidden`) so the whole app
fits in the viewport without a page-level scrollbar. `app-layout` fills the remaining height
(`flex: 1`, `min-height: 0`). `main-content` scrolls internally (`overflow-y: auto`),
which also benefits list pages (quotes, invoices) when tables are long.
The clock card no longer uses `aspect-ratio: 1/1` — it is now a fixed 130 × 130 px circle,
preventing it from stretching the row to hundreds of pixels. Padding, gap and margins were
tightened so both dashboard rows fit on a standard laptop screen without scrolling.


Next steps :


- adding SIRET si client = professionel
- remove securité et preferences dans reglages
- validation W3C
