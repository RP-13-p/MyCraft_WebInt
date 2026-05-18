# MyCraft

Raphael Partouche || Vincent Berardi || Razi Bouallagui

----------

### Step 1 

Created the main `index.html` dashboard and the settings page setting up the foundations of our webapp
Created the main css and js composants to set the design and UI foundations such as side bar and navbar or colors.


### Step 2

Added the Quotes and Invoices pages using the same layout structure as the dashboard.
Both pages contain a static form and a data table.
Updated `style.css` with shared styles for inner pages (form, table, line items, totals).
Fixed sidebar links on `index.html`.

**Next steps:**
- `clients.html` — Clients page
- `catalog.html` — Services catalogue
- - Set up a local JSON file to act as a mock database for our app data
- Write the JavaScript functions to update and store account information (company name, address, logo) using `localStorage` and using form interface 

### Step 3

Redesigned Quotes, Invoices and Clients pages to match wireframes.
Each page now shows summary cards (signed/paid counts) and a dynamic table or card grid
generated from localStorage, replacing static HTML content.

Moved creation forms to dedicated pages: `new_quote.html`, `new_invoice.html`, `new_client.html`.
Each saves to localStorage and redirects back to the list page.

Clients page displays a searchable mosaic of client cards instead of a table.

Moved all JavaScript files into a `js/` folder and updated references in all HTML pages.

**Next steps:**
- `catalog.html` — Services catalogue
- Link quotes/invoices to existing clients via a dropdown