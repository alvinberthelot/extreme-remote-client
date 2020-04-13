import { html } from "lit-html"
import headerComponent from "./header"
import mainComponent from "./main"
import footerComponent from "./footer"

export default function appComponent(game, steps) {
  return html`
    <div class="bg-purple-100 flex flex-col min-h-screen w-full">
      <div class="container mx-auto">
        ${headerComponent()} ${mainComponent(game, steps)} ${footerComponent()}
      </div>
    </div>
  `
}
