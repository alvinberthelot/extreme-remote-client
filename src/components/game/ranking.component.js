import { html } from "lit-html"
import { styleMap } from "lit-html/directives/style-map.js"
import hexToRgba from "hex-to-rgba"

export default function rankingComponent(team) {
  const colorStyle = {
    color: team.color,
  }
  const bgStyle = {
    background: hexToRgba(team.color, 0.1),
  }
  const borderStyle = {
    "border-left": `3px solid ${team.color}`,
  }

  return html`
    <div class="font-bold fontsize-lg flex mb-1 w-full rounded-l-lg">
      <!-- <span class="text-gray-300 mr-1">#</span> -->
      <div
        class="text-right text-gray-500 bg-gray-100 rounded-l-lg pr-2 py-1"
        style="width: 2rem"
      >
        ${team.rank + 1}
      </div>
      <div
        class="flex-grow py-1 pl-4"
        style=${styleMap({
          ...colorStyle,
          ...bgStyle,
          ...borderStyle,
        })}
      >
        ${team.name}
      </div>
      <div
        class="text-right text-gray-900 pr-2 py-1"
        style=${styleMap(bgStyle)}
      >
        ${team.score}
      </div>
    </div>
  `
}
