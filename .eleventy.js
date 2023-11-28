const pluginBookshop = require("@bookshop/eleventy-bookshop");
const yaml = require("js-yaml");
const svgContents = require("eleventy-plugin-svg-contents");
const esbuild = require('esbuild');
const { Tokenizer, assert } = require('liquidjs');
const path = require("node:path");
const fs = require('fs'); 
const Image = require("@11ty/eleventy-img");

const IMAGE_OPTIONS = {
	widths: [400, 800, 1280, 1600],
	formats: ["avif", "webp", "svg", "jpeg"],
	outputDir: "./_site/optimized/",
	urlPath: "/optimized/",
	// svgCompressionSize: "br",
};

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

  // Custom shortcodes
  eleventyConfig.addShortcode("image", async (srcFilePath, alt, className, sizes, preferSvg) => {
    let before = Date.now();
    let inputFilePath = srcFilePath == null ? srcFilePath : path.join(eleventyConfig.dir.input, srcFilePath);

    if (fs.existsSync(inputFilePath)) {
      let metadata = await Image(inputFilePath, Object.assign({
        svgShortCircuit: preferSvg ? "size" : false,
      }, IMAGE_OPTIONS));
      console.log( `[11ty/eleventy-img] ${Date.now() - before}ms: ${inputFilePath}` );

      return Image.generateHTML(metadata, {
        alt,
        class: className,
        sizes: sizes || "100vw", // Set default value to "100vw" if sizes is not provided
        loading: "eager",
        decoding: "async",
      });
    } else {
      return `<img class='${className}' src='${srcFilePath}' alt='${alt}'>`;
    }
  });
  
  eleventyConfig.addWatchTarget("component-library/");
  
  // Plugins
  eleventyConfig.addPlugin(svgContents);
  eleventyConfig.addPlugin(pluginBookshop({
    bookshopLocations: ["component-library"],
    pathPrefix: '',
  }));

  // Filters
  eleventyConfig.addFilter("markdownify", (markdown) => md.render(markdown));
  eleventyConfig.addFilter("ymlify", (yml) => yaml.load(yml));
  eleventyConfig.addFilter("militaryTime", function(value) { 
    const [time, period] = value.split(' '); 
    const [hour, minute] = time.split(':'); 
    let formattedHour = parseInt(hour); 
  
    if (period === 'pm' || period === 'PM') { 
        formattedHour += 12; 
    } 
  
    return `${formattedHour}:${minute}`; 
  });

  eleventyConfig.setBrowserSyncConfig({
    files: "./_site/css/**/*.css",
  });

    // Tags
    eleventyConfig.addLiquidTag('assign_local', function(liquidEngine) {
      return {
        parse: function (token) {
            const tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie);
            this.key = tokenizer.readIdentifier().content;
            tokenizer.skipBlank();
            assert(tokenizer.peek() === '=', () => `illegal token ${token.getText()}`);
            tokenizer.advance();
            this.value = tokenizer.remaining();
        },
        render: function(ctx) {
            ctx.scopes[ctx.scopes.length-1][this.key] = this.liquid.evalValueSync(this.value, ctx);
        }
    }
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