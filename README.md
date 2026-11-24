# Vestige — static HTML site

An original site ("Vestige", an at-home hair test for environmental exposure). All copy, brand marks, names and media are new.

## How to open it
Open `index.html` in a browser (double-click). No server or build step is needed.
Everything is local: fonts, images, videos, CSS and JS. No external requests.

## Structure
This folder is the deliverable. It is plain, hand-editable HTML.
```
index.html                home
product.html              product page (variants, gallery lightbox, add to cart, reviews)
what-we-test.html         pinned scroll sequence (oval mask → 3 element groups with tabs)
report.html  science.html  our-story.html  faqs.html  contact.html
journal.html  podcast.html  press.html
article-*.html            17 article pages (elements, food, founder, podcast, press)
cart.html  account.html  refund-policy.html  privacy.html  terms.html  404.html
assets/
  css/main.css            tokens, header, footer, buttons, pills, modals, accordions, carousel
  css/pages.css           page sections
  js/main.js              header, Learn menu, sticky CTA, reveal, pills timeline, carousel,
                          modals (newsletter popup, dialog), cart (localStorage), lazy video
  js/home.js              pinned video hero + how-it-works step sync
  js/wwt.js               what-we-test scroll sequence + tabs
  js/slides.js            story/science pinned slides, count-up numbers, oval parallax
  js/product.js           variants, add to cart, lightbox, element explorer, reviews
  js/journal.js           topic / element filters
  js/forms.js             contact validation, cart page, account sign-in demo
  fonts/                  self-hosted Source Serif 4, Geist, Geist Mono (+ fonts.css)
  img/                    photos and original SVGs (product kit, favicon, nav and menu icons)
  video/                  hero, story and lab videos (mp4)
```

## Editing
There is no generator in this folder. Edit the HTML, CSS and JS files directly.
Header, footer, CTA and modals are repeated in every page, so a change to one of them
must be made in each HTML file (use find-and-replace across the folder).

## States you can try
- Newsletter popup: shows once after 6 s or on exit intent, and is remembered for 7 days. Force it with `index.html?popup`.
- Learn dropdown: hover on desktop, tap on mobile, arrow keys and Escape.
- Product: switch plan (radio cards expand), Add to cart → toast + cart count, gallery “+” → lightbox (arrow keys).
- Cart: quantity +/−, remove, empty state, “Proceed to payment” opens a demo dialog.
- Contact and account forms validate inline; submitting shows a success state (nothing is sent anywhere).
- Journal: filter by topic card or element tile; “Show all” resets.
- Carousels: arrows, swipe, and arrow keys. Accordions everywhere.
- `prefers-reduced-motion` turns off the scroll animations and tickers.

## Placeholders to replace
- Brand “Vestige”, the logo glyph, “Vestige Labs Ltd.”, “Northfield Bio”, “Halden Institute”,
  “Dr Elias Marlowe”, the phone number and email, and “Placeholder Studio”.
- Social links (`#`), the sample report PDF (opens a dialog for now), and checkout (demo dialog).
- Policy pages contain placeholder legal text.
- Reviews and the founder are fictional. The portrait is an Unsplash stock photo.

## Media credits
- Photos: Unsplash (Unsplash License), in `assets/img/`.
- Videos: Mixkit (Mixkit free license): 49846, 4629, 1606, 4855 (home hero), 1178 (story), 52012 (lab / sample report).
- The product kit, favicon and menu thumbnails are original SVGs.
- Fonts (Google Fonts, OFL): Source Serif 4, Geist and Geist Mono, self-hosted.
