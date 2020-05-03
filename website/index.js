const { timer, combineLatest } = rxjs
const { fromFetch } = rxjs.fetch
const {
  map,
  tap,
  flatMap,
  switchMap,
  filter,
  takeWhile,
  share,
} = rxjs.operators

const SERVER = `https://www.xtreme-game.io`
// const SERVER = `http://localhost:8080`
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
  switchMap((id) => fromFetch(`${SERVER}/game/${id}/me`)),
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
  takeWhile((game) => game.isStopped === false, true),
  filter((game) => game.isStarted === true)
)

const steps$ = combineLatest([gameId$, metronome$]).pipe(
  switchMap(([id]) => fromFetch(`${SERVER}/game/${id}/step`)),
  flatMap((response) => response.json()),
  share()
)

const lastStep$ = steps$.pipe(
  filter((steps) => steps.length > 0),
  map((steps) => {
    return steps[steps.length - 1]
  })
)

const lastScores$ = lastStep$.pipe(
  map((step) => {
    return step.scores
  })
)

const teams$ = gameId$.pipe(
  switchMap((id) => fromFetch(`${SERVER}/game/${id}/team`)),
  flatMap((response) => response.json())
)

const render = (selector, html) => {
  const element = document.getElementById(selector)
  element.innerHTML = html
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

const renderGameHeader = (team, score) => {
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
            <span class="text-gray-700 mr-1">$</span>${score ? score.score : 0}
          </div>
        </div>
        <div class="w-1/2 text-center text-gray-100 font-bold pt-4">
          ${team ? team.name : ""}
        </div>
        <div class="w-1/4 text-right">
          <div class="text-base text-gray-700 font-bold uppercase pt-4">
            Rank
        </div>
          <div class="text-4xl text-gray-100 font-bold">
            <span class="text-gray-700 mr-1">#</span>${score ? score.rank : "?"}
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

const renderGameScores = (scores, teams) => {
  return `<ul>${scores
    .map((score) => {
      const team = find(teams, (team) => team.id === score.teamId)
      return `<li>${renderRanking(team, score)}</li>`
    })
    .join("")}</ul>`
}

const renderRanking = (team, score) => {
  const color = team ? team.color : "#FF0000"
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
        ${score.rank}
      </div>
      <div class="flex-grow py-1 pl-4" style="${styleMap(teamStyle)}">
        ${team ? team.name : ""}
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

combineLatest([teams$, steps$]).subscribe(([teams, steps]) =>
  renderStepsChart("game-chart", teams, steps)
)

combineLatest([lastScores$, myTeam$])
  .pipe(
    map(([scores, myTeam]) => {
      const score = find(
        scores,
        (score) => myTeam && myTeam.id === score.teamId
      )
      return { score, team: myTeam }
    })
  )
  .subscribe(({ score, team }) =>
    render("game-header", renderGameHeader(team, score))
  )
combineLatest([lastScores$, teams$]).subscribe(([scores, teams]) =>
  render("game-scores", renderGameScores(scores, teams))
)
