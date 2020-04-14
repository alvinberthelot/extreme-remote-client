import config from "../../tailwind.config"

export default function colors() {
  const configColors = config.theme.colors
  const colors = Object.keys(configColors)
    .filter((color) => typeof configColors[color] === "object")
    .reduce((acc, color) => {
      acc[color] = configColors[color]["500"]
      return acc
    }, {})
  return colors
}
