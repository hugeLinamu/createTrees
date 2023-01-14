<template>
    <canvas ref="myCanvas" width="600" height="600" style="border:1px solid #000000;">
    </canvas>
</template>

<script setup lang='ts'>
import { onMounted, computed, ref } from 'vue'
// 注意: onMounted 之后才能获得对应的dom
const myCanvas = ref<HTMLCanvasElement>()
// 加感叹号表示其值一定不会为undefined,null
const ctx = computed(() => myCanvas.value!.getContext("2d")!)

const HEIGHT = 600
const WIDTH = 600
const penddingTask: Function[] = []

onMounted(() => {
    init()
})

interface Point {
    x: number,
    y: number
}

interface Branch {
    start: Point,
    angle: number,
    length: number
}

function init() {
    const branch = {
        start: { x: WIDTH / 2, y: HEIGHT },
        length: 50,
        angle: -Math.PI / 2
    }
    drawLine(branch)
    step(branch)
}

function lineTo(start: Point, end: Point) {
    ctx.value.moveTo(start.x, start.y)
    ctx.value.lineTo(end.x, end.y)
    ctx.value.stroke()
}

// 画线
function drawLine(startPoint: Branch) {
    const { start } = startPoint
    const end = getEndPoint(startPoint)
    lineTo(start, end)
}

// 通过起始位置获得最终位置
function getEndPoint(startPoint: Branch) {
    const { start, angle, length } = startPoint
    return {
        x: start.x + length * Math.cos(angle),
        y: start.y + length * Math.sin(angle)
    }
}


// 生成左边分支
function generateLeftBranch(startPoint: Branch) {
    const end = getEndPoint(startPoint)
    const leftBranch = {
        start: end,
        length: 50,
        angle: startPoint.angle - 0.3
    }
    drawLine(leftBranch)
    return leftBranch
}

// 生成右边分支
function generateRightBranch(startPoint: Branch) {
    const end = getEndPoint(startPoint)
    const rightBranch = {
        start: end,
        length: 50,
        angle: startPoint.angle + 0.3
    }
    drawLine(rightBranch)
    return rightBranch
}


function step(startPoint: Branch) {
    if (Math.random() < 0.5) {
        const left = generateLeftBranch(startPoint)
        penddingTask.push(() => 
            step(left)
        )

    }
    if (Math.random() < 0.5) {
        const right = generateRightBranch(startPoint)
        penddingTask.push(() => 
            step(right)
        )
    }
}

function frame() {
    const task = [...penddingTask]
    penddingTask.length = 0
    task.forEach(fn => { fn() })
}
function startFrame(){
    requestAnimationFrame(()=>{
    frame()
    startFrame()
})
}
startFrame()

</script>

<style scoped >

</style>