import "./style.css"
import { html, render } from "lit-html"
import { timer, combineLatest } from "rxjs"
import { fromFetch } from "rxjs/fetch"
import { map, tap, scan, flatMap, switchMap, filter } from "rxjs/operators"
import * as moment from "moment"
import { sortBy, random } from "lodash"
import appComponent from "./components/app"

const SECOND = 1000

const metronome$ = timer(0, 10 * SECOND)

const gameId$ = fromFetch(`${process.env.SERVER}/game`).pipe(
  flatMap((response) => response.json()),
  map((games) => {
    let gameId = null
    if (games.length === 1) {
      gameId = games[0]
    } else if (process.env.GAME_ID) {
      gameId = process.env.GAME_ID
    } else {
      console.error("We can't determinate gameId !")
    }
    return gameId
  }),
  filter((val) => val)
)

const register$ = gameId$.pipe(
  switchMap((id) => fromFetch(`${process.env.SERVER}/game/${id}/register`)),
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
  switchMap(([id]) => fromFetch(`${process.env.SERVER}/game/${id}`)),
  flatMap((response) => response.json())
)

// const game$ = timer(START_GAME_AFTER).pipe(
//   map(() => {
//     const start = moment()
//     const end = moment(start).add(DURATION)
//     const game = {
//       id: "gameid87987",
//       yourTeam: "teamid2",
//       counter: 666,
//       // dateStart: start,
//       dateStart: null,
//       dateEnd: end,
//       teams,
//       isStarted: true,
//       isPaused: false,
//     }
//     return game
//   })
// )

const states$ = game$.pipe(
  map((game, index) => {
    const teams = game.teams
    const scores = Object.keys(teams).map((id) => ({
      id,
      score: random(100),
    }))

    const scoresSorted = sortBy(scores, [
      function (v) {
        return v.score
      },
    ]).reverse()

    return {
      game,
      step: {
        id: Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(0, 7),
        index,
        date: moment(),
        teams: scoresSorted.map((v, index) => {
          const team = teams[v.id]
          return { ...v, ...team, rank: index }
        }),
      },
    }
  }),
  scan(
    (acc, v) => ({
      game: v.game,
      steps: [...acc.steps, v.step],
    }),
    { steps: [] }
  )
)

states$.subscribe((state) => {
  // console.log("state", state)
  render(html`${appComponent(state.game, state.steps)}`, document.body)
})
