import "./style.css"
import { html, render } from "lit-html"
import { timer, combineLatest } from "rxjs"
import { take, map, scan } from "rxjs/operators"
import * as moment from "moment"
import appComponent from "./components/app"

const SECOND = 1000

const DURATION = 8 * SECOND
const START_GAME_AFTER = 2 * SECOND

const game$ = timer(START_GAME_AFTER).pipe(
  map(() => {
    const start = moment()
    const end = moment(start).add(DURATION)
    const game = {
      id: "gameid87987",
      counter: 666,
      dateStart: start,
      dateEnd: end,
      teams: {
        teamid1: "xtrem git",
        teamid2: "tutu git",
      },
      isStarted: true,
      isPaused: false,
    }
    return game
  })
)

const FREQUENCY_METRONOME = SECOND
const NUM_STEP = DURATION / FREQUENCY_METRONOME
const metronome$ = combineLatest([game$, timer(0, FREQUENCY_METRONOME)]).pipe(
  take(NUM_STEP + 1),
  map(([game, v]) => moment(game.dateStart).add(FREQUENCY_METRONOME * v))
)

// metronome$.subscribe((v) => {
//   console.log("METRO", v.format("h:mm:ss"))
// })

const steps$ = metronome$.pipe(
  map((date, index) => {
    return {
      id: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 7),
      index,
      date,
      teams: [
        {
          id: "teamid1",
          score: index ? Math.floor(Math.random() * Math.floor(100)) : 0,
          rank: 1,
        },
        {
          id: "teamid2",
          score: index ? Math.floor(Math.random() * Math.floor(100)) : 0,
          rank: 2,
        },
      ],
    }
  }),
  scan((all, current) => [...all, current], [])
)

// steps$.subscribe((data) => {
//   console.log("steps", data)
// })

combineLatest([game$, steps$]).subscribe(([game, steps]) => {
  render(html`${appComponent(game, steps)}`, document.body)
})
