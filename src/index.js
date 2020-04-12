import "./style.css";
import printMe from "./print.js";
import { html, render } from "lit-html";

const myTemplate = (name) => html`
  <div class="hello">Hello 3 ${name}</div>
  <button @click=${printMe}>Click me and check the console!</button>
`;

render(myTemplate("Alvin"), document.body);
