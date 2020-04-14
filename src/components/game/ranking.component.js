import { html } from "lit-html"
import teamComponent from "./team.component"

export default function rankingComponent(game) {
  const teams = Object.keys(game.teams).map((id) => game.teams[id])
  return html`
    <div class="font-bold text-xl text-gray-800">
      Ranking
    </div>
    <ul>
      ${teams.map((team) => html`${teamComponent(team)}`)}
    </ul>
  `
}
