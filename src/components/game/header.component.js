import { html } from "lit-html"
import * as moment from "moment"
import printMe from "../../tools/print"

export default function headerComponent(game, lastStep) {
  const lastStepTeam = lastStep.teams.filter(
    (team) => team.id === game.teamId
  )[0]

  return html`
    <div class="flex mb-4">
      <div class="w-1/4 py-4">
        <div
          class="text-base text-gray-400 font-bold uppercase pt-4"
          @click=${printMe}
        >
          <a href="" class="ml-2 text-gray-500">Game</a>
        </div>
        <div class="text-base text-gray-400 font-bold uppercase">
          <a href="" class="ml-2 text-gray-500">Code</a>
        </div>
      </div>
      <div class="w-1/2 bg-gray-900 shadow-lg rounded-b p-4 flex">
        <div class="w-1/4 text-left">
          <div class="text-base text-gray-700 font-bold uppercase pt-4">
            Score
          </div>
          <div class="text-4xl text-gray-100 font-bold">
            <span class="text-gray-700 mr-1">$</span>${lastStepTeam
              ? lastStepTeam.score
              : 0}
          </div>
        </div>
        <div class="w-1/2 text-center text-gray-100 font-bold pt-4">
          ${lastStepTeam ? lastStepTeam.name : ""}
        </div>
        <div class="w-1/4 text-right">
          <div class="text-base text-gray-700 font-bold uppercase pt-4">
            Rank
          </div>
          <div class="text-4xl text-gray-100 font-bold">
            <span class="text-gray-700 mr-1">#</span>${lastStepTeam
              ? lastStepTeam.rank
              : "?"}
          </div>
        </div>
      </div>
      <div class="w-1/4 py-4">
        <div
          class="text-right text-base text-gray-400 font-bold uppercase pt-4"
          @click=${printMe}
        >
          ${game.dateStart ? game.dateStart.format("LTS") : ""}
        </div>

        <div class="text-right text-4xl text-gray-900 font-bold">
          ${game.dateStop
            ? moment.utc(game.dateStop.diff(moment())).format("mm:ss")
            : ""}
        </div>
      </div>
    </div>
  `
}
