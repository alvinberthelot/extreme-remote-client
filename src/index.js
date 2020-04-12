import "./style.css"
import printMe from "./print.js"
import { html, render } from "lit-html"
import { interval } from "rxjs"
import { take } from "rxjs/operators"

const source$ = interval(1000).pipe(take(3))

source$.subscribe((val) => {
  render(myTemplate(val), document.body)
})

const myTemplate = (name) => html`
  <main class="bg-green-200">
    <div class="hello">Hello ${name}</div>
    <button @click=${printMe}>Click me and check the console!</button>
  </main>
`
