const Image = require("@11ty/eleventy-img");
const { imagePaths, imageUrlPath } = require("../constants/images");
const path = require("path");
const stringifyAttributes = require("../utilities/stringifyAttributes");
const outdent = require("outdent");

// /** Returns optimized image markup. Expects to receive a root-relative absolute path to the image (e.g., src/assets/images/image.png).
//  * Example usage: `{% image 'https://images.unsplash.com/photo-1608178398319-48f814d0750c', 'Alt text', 'optional c-classNames__img', [optional, 100,200,300] %}`.
//  */

const imageShortcode = async (src, alt, className = undefined, widths = [400, 800, 1280], formats = ["webp", "jpeg"], sizes = "100vw") => {
  const { dir, base } = path.parse(src);
  const inputPath = path.join(".", dir, base);
  const imageMetadata = await Image(inputPath, {
    filenameFormat: function (hash, src, width, format) {
      const { name } = path.parse(src);
      return `${name}-${width}-${hash}.${format}`;
    },
    widths: [...widths, null],
    formats: [...formats, null],
    outputDir: imagePaths.output,
    urlPath: imageUrlPath,
  });

  console.log(imageMetadata);

  const sourceHtmlString = Object.values(imageMetadata)
    // Map each format to the source HTML markup
    .map((images) => {
      // The first entry is representative of all the others
      // since they each have the same shape
      const { sourceType } = images[0];

      // Use our util from earlier to make our lives easier
      const sourceAttributes = stringifyAttributes({
        type: sourceType,
        // srcset needs to be a comma-separated attribute
        srcset: images.map((image) => image.srcset).join(", "),
        sizes,
      });

      // Return one <source> per format
      return `<source ${sourceAttributes}>`;
    })
    .join("\n");

  const getLargestImage = (format) => {
    const images = imageMetadata[format];
    return images[images.length - 1];
  };

  const largestUnoptimizedImg = getLargestImage(formats[0]);
  const imgAttributes = stringifyAttributes({
    src: largestUnoptimizedImg.url,
    alt,
    loading: "lazy",
    decoding: "async",
  });
  const imgHtmlString = `<img ${imgAttributes}>`;

  const pictureAttributes = stringifyAttributes({
    class: className,
  });
  const picture = `<picture ${pictureAttributes}>
    ${sourceHtmlString}
    ${imgHtmlString}
  </picture>`;

  return outdent`${picture}`;
};

module.exports = imageShortcode;
