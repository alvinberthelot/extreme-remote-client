import { html } from "lit-html"
import { styleMap } from "lit-html/directives/style-map.js"

export default function teamComponent(team) {
  const teamStyles = { color: team.color }
  return html`
    <div style=${styleMap(teamStyles)}>
      ${team.name}
    </div>
  `
}
