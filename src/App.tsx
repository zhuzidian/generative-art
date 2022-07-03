import React, { useEffect, useRef } from "react"
import "./App.css"

// generative art

// 分支的点
interface Point {
  x: number
  y: number
}

// 分支
interface Branch {
  start: Point
  length: number
  theta: number // 角度
}

function App() {
  const el = useRef<HTMLCanvasElement>(null)
  // 把要画的step先存起来
  const pendingTasks: Function[] = []

  // 画布的宽度和高度
  const WIDTH = 600
  const HEIGHT = 600

  function init() {
    const canvas = el.current!
    const ctx = canvas.getContext("2d")!

    ctx.strokeStyle = "#777"
    // 起点
    const branch = {
      start: { x: WIDTH / 2, y: HEIGHT },
      length: 30,
      theta: -Math.PI / 2,
    }
    step(ctx, branch)
  }

  function step(ctx: CanvasRenderingContext2D, b: Branch, depth = 0) {
    drawBranch(ctx, b)
    const end = getEndPoint(b)

    // 至少递归2次
    // 50%的几率画
    if (depth < 2 || Math.random() < 0.5) {
      const leftBranch: Branch = {
        start: end,
        length: b.length + Math.random() * 10 - 5,
        theta: b.theta - 0.3 * Math.random(),
      }
      pendingTasks.push(() => step(ctx, leftBranch, depth + 1))
    }
    if (depth < 2 || Math.random() < 0.5) {
      const rightBranch: Branch = {
        start: end,
        length: b.length + Math.random() * 10 - 5,
        theta: b.theta + 0.3 * Math.random(),
      }
      pendingTasks.push(() => step(ctx, rightBranch, depth + 1))
    }
  }

  function lineTo(ctx: CanvasRenderingContext2D, p1: Point, p2: Point) {
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
  }

  function drawBranch(ctx: CanvasRenderingContext2D, b: Branch) {
    lineTo(ctx, b.start, getEndPoint(b))
  }

  function getEndPoint(b: Branch) {
    return {
      x: b.start.x + b.length * Math.cos(b.theta),
      y: b.start.y + b.length * Math.sin(b.theta),
    }
  }

  function frame() {
    const tasks = [...pendingTasks]
    pendingTasks.length = 0
    tasks.forEach((fn) => fn())
  }

  function startFrame() {
    requestAnimationFrame(() => {
      frame()
      startFrame()
    })
  }

  useEffect(() => {
    init()

    startFrame()
  }, [])

  return (
    <div className="App">
      <canvas
        ref={el}
        width={WIDTH}
        height={HEIGHT}
        style={{ border: "1px solid #777" }}
      />
    </div>
  )
}

export default App
