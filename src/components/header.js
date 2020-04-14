import { html } from "lit-html"

export default function headerComponent() {
  return html`
    <header class="mt-4 px-4 text-6xl font-bold flex">
      <div class="w-1/4 text-right text-yellow-400 px-2">XTREM</div>
      <div class="w-1/2 text-gray-400 px-2">GAME DEV</div>
    </header>
  `
}
