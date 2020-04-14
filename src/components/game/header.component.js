import { html } from "lit-html"
import * as moment from "moment"
import printMe from "../../tools/print"

export default function headerComponent(game) {
  return html`
    <div class="flex mb-4">
      <div class="w-1/4 px-2 py-4">
        <div
          class="text-base text-gray-400 font-bold uppercase pt-4"
          @click=${printMe}
        >
          Partie ${game.counter}
        </div>
      </div>
      <div class="w-1/2 bg-gray-900 shadow-lg rounded-b p-4 flex">
        <div class="w-1/2 text-left">
          <div class="text-base text-gray-700 font-bold uppercase pt-4">
            Score
          </div>
          <div class="text-4xl text-gray-100 font-bold">
            <span class="text-gray-700">$ </span>328
          </div>
        </div>
        <div class="w-1/2 text-right">
          <div class="text-base text-gray-700 font-bold uppercase pt-4">
            Rank
          </div>
          <div class="text-4xl text-gray-100 font-bold">
            <span class="text-gray-700"># </span>13
          </div>
        </div>
      </div>
      <div class="w-1/4 px-2 py-4">
        <div
          class="text-right text-base text-gray-400 font-bold uppercase pt-4"
          @click=${printMe}
        >
          ${game.dateStart.format("LTS")}
        </div>

        <div class="text-right text-4xl text-gray-900 font-bold">
          ${moment.utc(game.dateEnd.diff(moment())).format("mm:ss")}
        </div>
      </div>
    </div>
  `
}
