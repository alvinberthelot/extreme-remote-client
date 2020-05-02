module.exports = function (eleventyConfig) {
  // minify the html output when running in prod
  if (process.env.NODE_ENV == "production") {
    eleventyConfig.addTransform(
      "htmlmin",
      require("./website/utils/minify-html.js")
    )
  }
  eleventyConfig.addPassthroughCopy("./website/robots.txt")
  eleventyConfig.addPassthroughCopy("./website/game")
  eleventyConfig.addPassthroughCopy("./src")
}
