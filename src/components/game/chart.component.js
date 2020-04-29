import { html } from "lit-html"
import { Chart } from "chart.js"
import { find } from "lodash"

export default function chartComponent(game, steps) {
  let canvasChart = document.getElementById("canvasChart")

  if (canvasChart) {
    var ctx = document.getElementById("canvasChart").getContext("2d")

    const chart = window.chart

    if (chart) {
      const lastStep = steps[steps.length - 1]
      chart.data.labels.push(lastStep.index)
      chart.data.datasets.forEach((dataset) => {
        const team = find(
          lastStep.scores,
          (team) => team.name === dataset.label
        )
        if (team) {
          dataset.data.push(team.score)
        }
      })
      chart.update()
    } else {
      const data = {
        labels: steps.map((step) => step.index),
        datasets: Object.keys(game.teams).map((teamId) => {
          const team = game.teams[teamId]
          return {
            label: team.name,
            backgroundColor: team.color,
            borderColor: team.color,
            data: steps.map((step) => {
              const scoreTeam = find(
                step.scores,
                (score) => score.teamId === teamId
              )
              return scoreTeam ? scoreTeam.score : 0
            }),
            fill: false,
          }
        }),
      }

      const config = {
        type: "line",
        data,
        options: {
          responsive: true,
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                ticks: { display: false },
              },
            ],
            yAxes: [
              // {
              //   display: false,
              // },
              {
                ticks: { display: false },
              },
            ],
          },
        },
      }

      window.chart = new Chart(ctx, config)
    }
  }

  return html` <div class="font-bold text-xl text-gray-400 py-2 uppercase">
      Evolution
    </div>
    <canvas id="canvasChart" width="400" height="300"></canvas>`
}
