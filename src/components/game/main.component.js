import { html } from "lit-html"
import headerComponent from "./header.component"
import rankingListComponent from "./ranking-list.component"
import chartComponent from "./chart.component"
import stepsComponent from "./steps.component"

export default function mainComponent(game, steps) {
  const lastStep = steps[steps.length - 1]
  return html`
    <main class="bg-white rounded shadow-2xl">
      <div class="px-4">
        ${headerComponent(game, lastStep)}
        <div class="flex my-6 py-4">
          <div class="w-1/4">
            ${rankingListComponent(lastStep)}
          </div>
          <div class="w-1/2 px-4">
            ${chartComponent(game, steps)}
          </div>
          <div class="w-1/4">
            ${stepsComponent(steps)}
          </div>
        </div>
      </div>
    </main>
  `
}
