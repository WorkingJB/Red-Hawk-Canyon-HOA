/**
 * All of the site's editable text lives in this file.
 *
 * To post news, change FAQs, or add board members, edit the values below and
 * push to GitHub. Vercel redeploys automatically in about a minute.
 *
 * The irrigation schedule and event calendar are NOT edited here. They are
 * pulled live from the HOA's Google Sheet and Google Calendar (see `sources`).
 */

export const site = {
  name: "Red Hawk Canyon HOA",
  legalName: "Red Hawk Canyon Owners Association",
  shortName: "Red Hawk Canyon",
  tagline: "Homeowners association for the Red Hawk Canyon neighborhood in Wenatchee, Washington.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.redhawkcanyonhoa.com").replace(/\/$/, ""),
  email: "redhawkcanyonhoa@gmail.com",
  city: "Wenatchee",
  county: "Chelan County",
  state: "WA",
  timeZone: "America/Los_Angeles",
  streets: ["Yarrow Road", "Sage Grouse Road", "Jennings Street", "5th Street"],
} as const;

export const sources = {
  /** Google Sheet holding the watering schedule. Must stay shared as "Anyone with the link can view". */
  irrigationSheetId: "1jF-JidSQo60WvgZKz7eUN-xlZmt1ISDhN7Ga4ZyTgWQ",
  /** Public Google Calendar for meetings and events. */
  calendarId: "redhawkcanyonhoa@gmail.com",
  /** Original CC&R file in Google Drive (a copy is served from /documents). */
  ccrsDriveId: "1A6VxxbdOY9t8Lo3vSef8OQyJaToe8DNy",
  /** How often (seconds) the site re-checks the Sheet and Calendar for changes. */
  revalidateSeconds: 900,
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/irrigation", label: "Irrigation" },
  { href: "/calendar", label: "Calendar" },
  { href: "/documents", label: "Documents" },
  { href: "/faq", label: "FAQs" },
  { href: "/board", label: "Board" },
  { href: "/spraying", label: "Spraying" },
  { href: "/contact", label: "Contact" },
] as const;

/* -------------------------------------------------------------------------- */
/* News                                                                        */
/* -------------------------------------------------------------------------- */

export type Announcement = {
  /** ISO date the notice was posted, e.g. "2026-04-15". */
  date: string;
  title: string;
  body: string;
  /** Optional ISO date after which the notice stops showing on the home page. */
  expires?: string;
  link?: { href: string; label: string };
};

/** Newest first. The home page shows anything that has not expired. */
export const announcements: Announcement[] = [
  {
    date: "2026-10-01",
    title: "Irrigation pump shut-off",
    body: "Reminder: the estimated shut-off of the neighborhood irrigation pump is the morning of Saturday, October 10, 2026. Plan to have your lines blown out after that date.",
    link: { href: "/irrigation#blowout", label: "Line blowout services" },
  },
];

/* -------------------------------------------------------------------------- */
/* Home page                                                                   */
/* -------------------------------------------------------------------------- */

export const home = {
  welcome:
    "Welcome to the official website of the Red Hawk Canyon Homeowners Association. Here you'll find everything you need to stay informed and engaged with our community, from event updates to irrigation schedules.",
  about: [
    "At Red Hawk Canyon HOA, we're dedicated to fostering a vibrant and friendly community where everyone feels at home. The association is committed to maintaining the beauty and function of our neighborhood while making sure every resident has a voice in community matters.",
    "We oversee irrigation maintenance, organize community events, and provide essential services for the neighborhood. Our board of directors is made up of volunteers who are always ready to help and listen to your feedback.",
  ],
  responsibilities: [
    { title: "Irrigation system", body: "The association owns and maintains the pump and pipeline that deliver irrigation water to every lot." },
    { title: "Storm water pond", body: "The association maintains the neighborhood storm water retention pond." },
    { title: "Entry sign and lighting", body: "The association maintains, insures, and repairs the entryway sign and lighting." },
    { title: "Community events", body: "The board organizes the yearly homeowners meeting and other neighborhood events." },
  ],
};

/* -------------------------------------------------------------------------- */
/* Irrigation                                                                  */
/* -------------------------------------------------------------------------- */

export type Faq = { q: string; a: string };

export const irrigation = {
  intro:
    "Red Hawk Canyon shares a single irrigation pump, so each home is assigned a one-hour watering window. Please set your controller to run only during your assigned time so every lot gets enough pressure.",
  faqs: [
    {
      q: "Where can I find the irrigation watering schedule?",
      a: "See the watering schedule at the top of the Irrigation page. Type your address or last name in the search box to jump straight to your time slot.",
    },
    { q: "What should I do if my irrigation isn't working?", a: "Coming soon." },
    { q: "What should I do if I have a broken pipe?", a: "Coming soon." },
  ] satisfies Faq[],
  blowoutVendors: [
    {
      name: "Frank Godfrey",
      phone: "(509) 670-6836",
      note: "Proceeds go to several school groups (band, track and field, special ed prom, and more).",
      cost: "$50 minimum donation",
    },
    { name: "Osorio's", phone: "(509) 669-0587" },
    {
      name: "AllThrive",
      phone: "(509) 888-2935",
      note: "Text Courtney for a schedule.",
      cost: "$67, or $60 cash at the time of service",
      textOnly: true,
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Spraying                                                                    */
/* -------------------------------------------------------------------------- */

export const spraying = {
  intro:
    "Coming soon.",
};

/* -------------------------------------------------------------------------- */
/* General FAQs                                                                */
/* -------------------------------------------------------------------------- */

export const faqs: Faq[] = [
  {
    q: "What are the annual HOA dues?",
    a: "$200 per year, due on June 1st.",
  },
];

/** Shown under the general FAQs until more are added. Set to "" to hide. */
export const faqsComingSoon = "More FAQs coming soon.";

/* -------------------------------------------------------------------------- */
/* Board                                                                       */
/* -------------------------------------------------------------------------- */

export type BoardMember = { name: string; role: string; email?: string };

/** Add members here, e.g. { name: "Jane Doe", role: "President" }. */
export const board: BoardMember[] = [];

/* -------------------------------------------------------------------------- */
/* Governing documents                                                         */
/* -------------------------------------------------------------------------- */

export const documents = [
  {
    slug: "ccrs",
    title: "Declaration of Covenants, Conditions & Restrictions (CC&Rs)",
    description:
      "The recorded rules for Red Hawk Canyon covering the owners association, assessments, building standards, and use of each lot. Recorded with the Chelan County Auditor on May 15, 2009 (AFN 2303188). 31 pages.",
    href: "/documents/red-hawk-canyon-ccrs.pdf",
    sizeLabel: "PDF, 1.4 MB",
  },
];

/** Plain-language highlights. The recorded document controls if anything here differs. */
export const ccrHighlights: { section: string; title: string; points: string[] }[] = [
  {
    section: "Article III",
    title: "Architectural approval",
    points: [
      "A three-member Aesthetic Control Committee, appointed by the board from lot owners, reviews building plans.",
      "Submit house elevations, exterior specifications (including body, trim, and accent paint colors), and a plot plan at least 30 days before construction.",
      "The same approval is required for later exterior alterations, additions, or changes in materials or color scheme.",
    ],
  },
  {
    section: "Article IV",
    title: "Association and assessments",
    points: [
      "Every lot owner is a member of the Red Hawk Canyon Owners Association.",
      "The association maintains the irrigation pump and system, the storm water retention pond, and the entryway sign and lighting.",
      "Assessments are equal for all owners and fund common expenses plus a reserve fund. The board may levy special assessments for unexpected repairs.",
      "Unpaid assessments, with interest and collection costs, become a lien on the lot.",
      "Owners must maintain their property. The association may give 30 days' written notice for required maintenance.",
    ],
  },
  {
    section: "Article V",
    title: "Structures",
    points: [
      "Homes must be site-built and meet building code. Driveways must be paved.",
      "Fences are backyard-only, need approval, must be wood, brick, stucco, vinyl, or iron, and max out at six feet.",
      "Exterior work must be finished within nine months of the building permit.",
      "Each lot's irrigation connects to both domestic and irrigation water, with the parking strip on its own zone.",
    ],
  },
  {
    section: "Article VI",
    title: "General covenants",
    points: [
      "No subdividing lots, and no activity that becomes a nuisance to the neighborhood.",
      "Household pets only. Keep pets on your lot, leashed in the neighborhood, and clean up after them.",
      "Garbage cans must be screened or kept out of view.",
      "Lawns must be watered, mowed, and trimmed at least weekly in summer. Fruit trees must be kept free of insects and disease.",
      "Signs are limited to six square feet (for sale or rent signs are allowed). Home businesses need city and board approval and may not involve on-site sales or customer visits.",
      "No major vehicle repairs outside a closed garage. RVs, boats, trailers, and similar items must be screened from view.",
      "No exterior fires except barbecues and city-approved fire features. No fireworks or firearms unless approved by the board.",
      "Exterior lighting must be approved and follow Dark Skies guidelines.",
      "Each home needs off-street parking for two cars. On-street parking is temporary only.",
    ],
  },
  {
    section: "Article VIII",
    title: "Amendments",
    points: [
      "Amendments need approval from a majority of the board and then a majority of members, either at a meeting or by written consent.",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Photos                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Photos used on the site. All come from Wikimedia Commons under Creative
 * Commons licenses that require credit, which the footer shows automatically.
 * If you swap in your own photos, update or remove the matching entry.
 */
export const photos = {
  hero: {
    src: "/images/columbia-river-dusk-porters-pond.jpg",
    width: 1920,
    height: 1081,
    alt: "The Columbia River at dusk from Porters Pond in East Wenatchee, with city lights and snowy hills beyond",
    title: "Columbia River Porters Pond",
    author: "Thayne Tuason",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Columbia_River_Porters_Pond.jpg",
  },
  valley: {
    src: "/images/saddle-rock-wenatchee-valley.jpg",
    width: 1600,
    height: 900,
    alt: "View from the Saddle Rock Natural Area over Wenatchee and the Columbia River",
    title: "Saddle Rock Natural Area",
    author: "Steven Pavlov",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2024-04-20_DJI_Saddle_Rock_Natural_Area_183658.jpg",
  },
  riverfront: {
    src: "/images/columbia-river-riverfront-park.jpg",
    width: 1920,
    height: 1081,
    alt: "Looking north up the Columbia River from the Wenatchee Riverfront Park dock",
    title: "Looking north on Columbia River from Wenatchee Riverfront Park Dock",
    author: "Thayne Tuason",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Looking_north_on_Columbia_River_from_Wenatchee_Riverfront_Park_Dock_Washington.jpg",
  },
} as const;
