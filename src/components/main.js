import { html } from "lit-html"
import { Chart } from "chart.js"
import stepsComponent from "./steps"
import gameComponent from "./game"

const chartColors = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)",
]

export default function mainComponent(game, steps) {
  let canvasChart = document.getElementById("canvasChart")

  // console.log("steps", steps)

  if (canvasChart) {
    var ctx = document.getElementById("canvasChart").getContext("2d")

    const chart = window.chart

    if (chart) {
      const lastStep = steps[steps.length - 1]

      chart.data.labels.push(lastStep.index)
      chart.data.datasets.forEach((dataset, index) => {
        dataset.data.push(lastStep.teams[index].score)
      })

      chart.update()
    } else {
      const data = {
        labels: steps.map((step) => step.index),
        datasets: Object.keys(game.teams).map((key, index) => {
          return {
            label: `Team ${key}`,
            backgroundColor: chartColors[index],
            borderColor: chartColors[index],
            data: steps.map(
              (step) => step.teams.filter((team) => team.id === key)[0].score
            ),
            fill: false,
          }
        }),
      }

      const config = {
        type: "line",
        data,
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Step",
              },
            },
            y: {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "$",
              },
            },
          },
        },
      }

      window.chart = new Chart(ctx, config)
    }
  }

  return html`
    <main class="bg-white rounded shadow-lg">
      <div class="p-4">
        <div class="px-4">
          ${gameComponent(game)}
        </div>
        <div class="flex mb-4">
          <div class="w-1/2 px-4">
            <canvas id="canvasChart" width="400" height="400"></canvas>
          </div>
          <div class="w-1/2 px-4">
            ${stepsComponent(steps)}
          </div>
        </div>
      </div>
    </main>
  `
}
