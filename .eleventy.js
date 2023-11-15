const pluginBookshop = require("@bookshop/eleventy-bookshop");
const yaml = require("js-yaml");
const svgContents = require("eleventy-plugin-svg-contents");
const imageShortcode = require("./11ty/shortcodes/image");
const esbuild = require('esbuild');

const MarkdownIt = require("markdown-it"),
  md = new MarkdownIt({
    html: true,
  });

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/uploads");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/styles");
  eleventyConfig.addPassthroughCopy("css");

  // Data extensions
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
  // Bookshop
  eleventyConfig.addWatchTarget("component-library/");

  eleventyConfig.addPlugin(
    pluginBookshop({
      bookshopLocations: ["component-library"],
      pathPrefix: "",
    })
  );

  // Custom shortcodes
  eleventyConfig.addShortcode("image", imageShortcode);
  
  // Plugins
  eleventyConfig.addPlugin(svgContents);
  eleventyConfig.addPlugin(pluginBookshop({
    bookshopLocations: ["component-library"],
    pathPrefix: '',
  }));

  // Filters
  eleventyConfig.addFilter("markdownify", (markdown) => md.render(markdown));
  eleventyConfig.addFilter("ymlify", (yml) => yaml.load(yml));

  eleventyConfig.setBrowserSyncConfig({
    files: "./_site/css/**/*.css",
  });

  eleventyConfig.addFilter('contains_block', function(content_blocks, blockName) {
    if (!Array.isArray(content_blocks)) {
      return false;
    }
    return content_blocks.some(block => block._bookshop_name === blockName);
  });

  eleventyConfig.setBrowserSyncConfig({
    files: './_site/css/**/*.css'
  });

  // esbuild
  eleventyConfig.addWatchTarget('./src/assets/js/**');
  eleventyConfig.on('eleventy.before', async () => {
    await esbuild.build({
      entryPoints: ['src/assets/js/**'],
      outdir: '_site/assets/js',
      bundle: true,
      minify: true,
      sourcemap: true,
    });
  });

  return {
      dir: {
          input: "src",
          output: "_site"
      }
  }
}