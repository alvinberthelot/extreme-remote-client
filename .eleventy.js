module.exports = function (eleventyConfig) {
  // minify the html output when running in prod
  if (process.env.NODE_ENV == "production") {
    eleventyConfig.addTransform(
      "htmlmin",
      require("./src/utils/minify-html.js")
    )
  }
  eleventyConfig.addPassthroughCopy("src/robots.txt")
  eleventyConfig.addPassthroughCopy("game")
}
