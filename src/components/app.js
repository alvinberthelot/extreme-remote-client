import { html } from "lit-html"
import headerComponent from "./header"
import mainComponent from "./game/main.component"
import footerComponent from "./footer"

export default function appComponent(game, steps) {
  return html`
    <div class="bg-gray-100 flex flex-col min-h-screen w-full">
      <div class="container mx-auto">
        <div class="-mb-8">${headerComponent()}</div>
        <div class="">${mainComponent(game, steps)}</div>
        <div>${footerComponent()}</div>
      </div>
    </div>
  `
}
