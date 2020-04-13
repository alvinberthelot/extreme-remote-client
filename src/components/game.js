import { html } from "lit-html"
import * as moment from "moment"
import printMe from "../tools/print"

export default function gameComponent(game) {
  return html`
    <div class="flex mb-4">
      <div class="w-1/4">
        <div class="text-2xl font-bold" @click=${printMe}>
          Partie ${game.counter}
        </div>
      </div>
      <div class="w-1/2"></div>
      <div class="w-1/4">
        <div class="text-right">
          ${game.dateStart.format("LTS")}
        </div>
        <div class="text-right text-2xl font-bold">
          ${moment.utc(game.dateEnd.diff(moment())).format("HH:mm:ss")}
        </div>
      </div>
    </div>
  `
}
