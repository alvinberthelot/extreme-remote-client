import "./style.css"
import { html, render } from "lit-html"
import { timer, combineLatest } from "rxjs"
import { fromFetch } from "rxjs/fetch"
import { map, tap, flatMap, switchMap, filter, takeWhile } from "rxjs/operators"
import * as moment from "moment"
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
      console.error("We can't determinate your game !")
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
  flatMap((response) => response.json()),
  map((game, index) => ({
    ...game,
    dateStart: game.dateStart ? moment(game.dateStart) : null,
    datePause: game.datePause ? moment(game.datePause) : null,
    dateStop: game.dateStop ? moment(game.dateStop) : null,
    teamId: process.env.TEAM_ID,
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
  // tap((game) => {
  //   console.log("Game", game.isStarted, game.isStopped)
  // }),
  filter((game) => game.isStarted === true)
)

game$.subscribe((game) => {
  console.log("game", game)
  render(html`${appComponent(game)}`, document.body)
})
