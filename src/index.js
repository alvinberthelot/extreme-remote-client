const { timer, combineLatest } = rxjs
const { fromFetch } = rxjs.fetch
const { map, tap, flatMap, switchMap, filter, takeWhile } = rxjs.operators

const SERVER = `https://www.xtreme-game.io`
const GAME_ID = null
const TEAM_ID = null

const SECOND = 1000
const metronome$ = timer(0, 20 * SECOND)

const gameId$ = fromFetch(`${SERVER}/game`).pipe(
  flatMap((response) => response.json()),
  map((games) => {
    const activeGames = games.filter(
      (game) => game.isStarted && !game.isStopped
    )
    let gameId = null
    if (activeGames.length === 1) {
      gameId = activeGames[0].id
    } else if (GAME_ID) {
      gameId = GAME_ID
    } else {
      const message = "We can't determinate your game !"
      console.error(message)
      render("game-header", renderErrorHeader(message))
    }
    return gameId
  }),
  filter((val) => val)
)

const myTeam$ = gameId$.pipe(
  switchMap((id) => fromFetch(`${SERVER}/game/${id}/myteam`)),
  flatMap((response) => response.json()),
  map((data) => data.team)
)

const register$ = combineLatest([gameId$, myTeam$]).pipe(
  filter(([gameId, myTeam]) => !myTeam),
  map(([gameId, myTeam]) => gameId),
  switchMap((id) => fromFetch(`${SERVER}/game/${id}/register`)),
  flatMap((response) => response.json()),
  tap((data) => {
    if (data.error) {
      throw new Error(data.error.message)
    }
  })
)
register$.subscribe(
  (data) => {
    console.log("register", data)
  },
  (err) => {
    console.error(err.message)
  }
)

const game$ = combineLatest([gameId$, metronome$]).pipe(
  switchMap(([id]) => fromFetch(`${SERVER}/game/${id}`)),
  flatMap((response) => response.json()),
  map((game, index) => ({
    ...game,
    // dateStart: game.dateStart ? moment(game.dateStart) : null,
    // datePause: game.datePause ? moment(game.datePause) : null,
    // dateStop: game.dateStop ? moment(game.dateStop) : null,
    teamId: TEAM_ID,
    steps: game.steps.map((step) => {
      return {
        ...step,
        scores: step.scores.map((score) => {
          const team = game.teams[score.teamId]
          return {
            ...score,
            ...team,
          }
        }),
      }
    }),
  })),
  takeWhile((game) => game.isStopped === false, true),
  filter((game) => game.isStarted === true)
)

combineLatest([game$, myTeam$])
  .pipe(
    tap(([game, myTeam]) => {
      // console.log("Game", game)
      // console.log("MyTeam", myTeam)
    })
  )
  .subscribe(([game, myTeam]) => {
    renderGame({ game, myTeam })
  })

const renderGame = ({ game, myTeam }) => {
  const { steps, teams } = game
  const lastStep = steps[steps.length - 1]
  const scores = lastStep.scores
  const scoreTeam = find(
    lastStep.scores,
    (score) => myTeam && myTeam.id === score.teamId
  )
  render("game-header", renderGameHeader(scoreTeam))
  render("game-scores", renderGameScores(myTeam, scores))
  render("game-jobs", renderGameJobs())
  renderGameChart("game-chart", game)
}

const render = (selector, html) => {
  const element = document.getElementById(selector)
  element.innerHTML = html
}

const renderGameChart = (selector, game) => {
  const steps = game.steps
  let canvasChart = document.getElementById(selector)

  if (canvasChart) {
    var ctx = document.getElementById(selector).getContext("2d")

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
}

const renderErrorHeader = (message) => {
  return `
    <div class="flex mb-4">
      <div class="w-1/4 py-4"></div>
      <div class="w-1/2 bg-red-600 text-white font-bold uppercase shadow-lg rounded-b p-4 flex">${message}</div>
      <div class="w-1/4 py-4"></div>
    </div>
  </div>
  `
}

const renderGameHeader = (myTeam, lastStepTeam) => {
  return `
    <div class="flex mb-4">
      <div class="w-1/4 py-4">
        <div class="text-base text-gray-400 font-bold uppercase pt-4">
        <a href="" class="text-gray-500">Game</a>
      </div>
      <div class="text-base text-gray-400 font-bold uppercase">
        <a href="" class="text-gray-500">Code</a>
      </div>
    </div>
      <div class="w-1/2 bg-gray-900 shadow-lg rounded-b p-4 flex">
        <div class="w-1/4 text-left">
          <div class="text-base text-gray-700 font-bold uppercase pt-4">
            Score
        </div>
          <div class="text-4xl text-gray-100 font-bold">
            <span class="text-gray-700 mr-1">$</span>${
              lastStepTeam ? lastStepTeam.score : 0
            }
          </div>
        </div>
        <div class="w-1/2 text-center text-gray-100 font-bold pt-4">
          ${myTeam ? myTeam.name : ""}
        </div>
        <div class="w-1/4 text-right">
          <div class="text-base text-gray-700 font-bold uppercase pt-4">
            Rank
        </div>
          <div class="text-4xl text-gray-100 font-bold">
            <span class="text-gray-700 mr-1">#</span>${
              lastStepTeam ? lastStepTeam.rank : "?"
            }
          </div>
        </div>
      </div>
      <div class="w-1/4 py-4">
        <div class="text-right text-base text-gray-400 font-bold uppercase pt-4" @{printMe}">
        
      </div>
      <div class="text-right text-4xl text-gray-900 font-bold">
        
      </div>
    </div>
  </div>
  `
}

const renderGameJobs = () => {
  return `JOBS`
}

const renderGameScores = (myTeam, scores) => {
  return `<ul>${scores
    .map((score) => `<li>${renderRanking(myTeam, score)}</li>`)
    .join("")}</ul>`
}

const renderRanking = (myTeam, score) => {
  const color = myTeam ? myTeam.color : "#FF0000"
  const colorStyle = {
    color: color,
  }
  const bgStyle = {
    background: `hexToRgba(${color}, 0.1)`,
  }
  const borderStyle = {
    "border-left": `3px solid ${color}`,
  }
  const teamStyle = {
    ...bgStyle,
    ...borderStyle,
  }
  return `
    <div class="font-bold fontsize-lg flex mb-1 w-full bg-gray-100 rounded-l-lg">
      <!-- <span class="text-gray-300 mr-1">#</span> -->
      <div class="text-right text-gray-500 rounded-l-lg pr-2 py-1" style="width: 2rem">
        ${score.rank + 1}
      </div>
      <div class="flex-grow py-1 pl-4" style="${styleMap(teamStyle)}">
        ${score.name}
      </div>
      <div class="text-right text-gray-900 pr-2 py-1" style="${styleMap(
        bgStyle
      )}">
        <span style="${styleMap(colorStyle)}">$</span >${score.score}
      </div>
    </div>
  `
}

const find = (list, predicate) => {
  return list.filter(predicate)[0]
}

const styleMap = (properties) => {
  return Object.keys(properties)
    .map((k) => mapPropertyStyle(k, properties[k]))
    .join(";")
}

const mapPropertyStyle = (propertyKey, propertyValue) =>
  `${propertyKey}: ${propertyValue}`
