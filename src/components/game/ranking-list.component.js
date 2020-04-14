import { html } from "lit-html"
import rankingComponent from "./ranking.component"

export default function rankingListComponent(steps) {
  const lastStep = steps[steps.length - 1]
  const teams = lastStep.teams

  return html`
    <div class="font-bold text-xl text-gray-400 py-2 uppercase">
      Ranking
    </div>
    <ul>
      ${teams.map((team) => html`${rankingComponent(team, steps)}`)}
    </ul>
  `
}
