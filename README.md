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
- Configurable fonts
- Optimised for editing in CloudCannon
- Responsive layouts

## Setup

Get a workflow going to see your site's output (with [CloudCannon](https://app.cloudcannon.com/) or locally).

## Local Quickstart

1. Run `npm i` to install the modules.
2. Run `npm run start` to run the project. this will create a \_site folder, where all the developed file will remain.

By default the site will be at `http://localhost:8080`

## Editing

Small Business Template Eleventy (TBC) is set up for adding, updating and removing pages, components, posts, navigation and footer elements in [CloudCannon](https://app.cloudcannon.com/).

Changes in the data files require the site to be rebuilt to see your changes.

### Nav/footer details

- Reused around the site to save multiple editing locations.
- Set in the *Data* / *Nav* and *Data* / *Footer* sections
- Changes in these files are not reflected in live editing - you must save to see the changes in page building

### SEO details and favicon

- Favicon and site SEO details are set in the *Data* / *SEO* section
- Page SEO details are set in the frontmatter for each page (if they aren't set the site SEO details are used by default)

### Theme colors and Fonts

- Theme colors and fonts can be set in *Data* / *Theme*
- The colors will update on the next build
- More font options can be added in *Data* / *Fonts*

## Forms

You can use the form component to create a form with a range of inputs. This component is set up to submit to a CloudCannon inbox as long as you configure the inbox key following the instructions below. If you want to integreate your custom form with custom submission actions you can use the embed component.

- Create an inbox for your organisation/site following [these instructions](https://cloudcannon.com/documentation/articles/creating-an-inbox-to-receive-your-forms/) - note down the key that you use
- Connect your site to your inbox following [these instructions](https://cloudcannon.com/documentation/articles/connecting-your-site-to-an-inbox/)
- Add a "Form" and "Form Builder" component
- Add your inbox key to the relevant field in the form builder

The form component has validation and error messages build in.

## Image optimisation

The site uses the [eleventy image plugin](https://www.11ty.dev/docs/plugins/image/) to optimise your images.

To keep build times short you can set preserved paths for your image optimisations by setting preserved paths follwing the instructions below:

1. Within your site on CloudCannon navigate to Site Settings (found at the bottom of the site sidebar)

2. Navigate to the configuration tab

3. Open "caching options"

4. Add `node_modules/,_site/optimized/` to the preserved paths section

This will mean that only new/updated images get optimised on build.

## embedding content

- The "Embed" component is built to be generic and support any embed, however we cannot guarantee it will work seemlessly with all embeddable content.
- We recommend using other components to check if they can meet your requirements first.
- We have succesfully tested the following embeds:
    - google forms
    - hubspot forms
    - instagram
    - Spotify
    - X (formerly Twitter)
    - Google docs
    - YouTube video (although we would recommend using the Centered Large Asset component with a video instead)
    - Lottie files
    - PDFs

All options in the above list (except Youtube Videos) requires you to use the "embed" component.

## Accessibility

We have made efforts to prioritize accessibility in our design, but we acknowledge that it may not be perfect. Your feedback is valuable to us, so please feel free to share any suggestions or concerns to help us improve accessibility further.

## Component links

All blocks have an id field that can be set and then used as a link to that component. 

This is helpful (for example) if you want to link to information about your services from the nav without having a fully seperate page for it. You can set the id field in the services block to be `services` and then in *data/nav* you can have a link to `#services`.

## Development

### Postprocessing

(TBC) This template uses PostCSS

### Design decisions

- Local CSS variable names are prefixed with `_`
- Global variables have no prefix