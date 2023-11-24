# small-business-template-eleventy

Small Business Template Eleventy (TBC) is a polished, marketing website template for Eleventy. Browse through a [live demo]( https://plucky-lapwing.cloudvent.net).


(TBC) ![Small business template screenshot](/site/images/_screenshot.png)

[![Deploy to CloudCannon](https://buttons.cloudcannon.com/deploy.svg)](https://app.cloudcannon.com/register#sites/connect/github/CloudCannon/small-business-template-eleventy)

## Features

- Pre-built pages
- Pre-styled components
- Configurable navigation and footer
- Multiple hero options
- Configurable form, gallery, image, video, pricing, left/right block, and more components
- Generic Embed component for custom embeds
- Configurable theme colors
- Optimised for editing in CloudCannon
- Accessible and responsive

## Setup

Get a workflow going to see your site's output (with [CloudCannon](https://app.cloudcannon.com/) or locally).

## Prerequisites

## Quickstart

1. Run `npm i` to install the modules.
2. Run `npm run start` to run the project. this will create a \_site folder, where all the developed file will remain.

By default the site will be at `http://localhost:8080`

## Editing

Small Business Template Eleventy (TBC) is set up for adding, updating and removing pages, components, posts, navigation and footer elements in [CloudCannon](https://app.cloudcannon.com/).

If you are running locally you should rebuild the site to see your changes.

### Nav/footer details

- Reused around the site to save multiple editing locations.
- Set in the *Data* / *Navigation* and *Data* / *Footer* sections

### SEO details and favicon

- Favicon and site SEO details are set in the *Data* / *SEO* section

### Theme colors and Fonts

- Theme colors can be set in *Data* / *Theme*
- The colors will update on the next build
- Fonts can be set in *Data* / *Fonts*

## Forms

- Add a "Form" and "Form Builder" component

## Image optimisation
- Preserved paths for image optimisations

## Embeding content

See dedicated components for video, image gallery, maps

- "Embed" component is built to be generic and support any embed.
- However we cannot guarantee it will work with all other embeds.
- We recommend using the dedicated "Gallery", "Video", "Maps" embeds where possible.
- We have succesfully tested the following embeds:
    - google forms
    - hubspot forms
    - instagram
    - Spotify
    - X (formerly Twitter)
    - Google docs
    - YouTube video (although we would recommend using the video component instead)
    - Lottie files
    - PDFs

## Accessibility

(TBC) we made the following decisions regarding accessibility.

## Services Block and Nav Link

(TBC) This uses an anchor tag

## Development

### Postprocessing

(TBC) This template uses PostCSS

### Design decisions

- Local CSS variable names are prefixed with `_`
- Global variables have no prefix