import "./style.css"
import { html, render } from "lit-html"
import { timer, combineLatest } from "rxjs"
import { take, map, scan } from "rxjs/operators"
import * as moment from "moment"
import { sortBy, random } from "lodash"
import appComponent from "./components/app"
import colors from "./tools/colors"

const TEAM_COLORS = colors()
const TEAM_COLORS_NAME = Object.keys(TEAM_COLORS)

const SECOND = 1000

const DURATION = 12 * SECOND
const FREQUENCY_METRONOME = 2 * SECOND
const START_GAME_AFTER = 2 * SECOND

const NUM_TEAM = 6
let teams = {}
for (let index = 0; index < NUM_TEAM; index++) {
  const indexColor = (index + 1) % TEAM_COLORS_NAME.length

  teams[`teamid${index + 1}`] = {
    name: `teamid${index + 1}`,
    // name: Math.random()
    //   .toString(36)
    //   .replace(/[^a-z]+/g, "")
    //   .substr(0, 7),
    color: TEAM_COLORS[TEAM_COLORS_NAME[indexColor]],
  }
}

const game$ = timer(START_GAME_AFTER).pipe(
  map(() => {
    const start = moment()
    const end = moment(start).add(DURATION)
    const game = {
      id: "gameid87987",
      yourTeam: "teamid2",
      counter: 666,
      dateStart: start,
      dateEnd: end,
      teams,
      isStarted: true,
      isPaused: false,
    }
    return game
  })
)

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
    const scores = Object.keys(teams).map((id) => ({
      id,
      score: index ? random(100) : 0,
    }))

    const scoresSorted = sortBy(scores, [
      function (v) {
        return v.score
      },
    ]).reverse()

    return {
      id: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 7),
      index,
      date,
      teams: scoresSorted.map((v, index) => {
        const team = teams[v.id]
        return { ...v, ...team, rank: index }
      }),
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
