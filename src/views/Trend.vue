<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import {partMap, getSalaryData} from "@/scripts/data-utils.js";
import regression from 'regression'

let salaryData
const stackedChartRef = ref(null)
const lineChartRef = ref(null)

function updateStackedChart() {
  const dates = salaryData.map(item => item.date)

  // 组成部分的 key（排除 total 和 date）
  const keys = Object.keys(salaryData[0]).filter(k => !['date', 'total'].includes(k))

  const stackSeries = keys.map(key => ({
    name: partMap[key] || key,
    type: 'bar',
    stack: '工资',
    emphasis: { focus: 'series' },
    data: salaryData.map(item => item[key])
  }))

  const stackedChart = echarts.init(stackedChartRef.value)
  stackedChart.setOption({
    title: { text: '工资构成堆叠图', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0 },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value' },
    series: stackSeries
  })
}

function updateLineChart() {
  const dates = salaryData.map(item => item.date)
  const total = salaryData.map(item => item.total)

  // 1️⃣ 用索引做 x，total 做 y，计算线性回归
  const dataForRegression = total.map((y, i) => [i, y])
  const result = regression.linear(dataForRegression)
  const predicted = result.points.map(p => p[1]) // 只取 y 值

  const lineChart = echarts.init(lineChartRef.value)

  lineChart.setOption({
    title: { text: '工资总额趋势图', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['总额', '趋势线'], bottom: 0 },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value' },
    series: [
      {
        name: '总额',
        type: 'line',
        data: total,
        smooth: true,
      },
      {
        name: '趋势线',
        type: 'line',
        smooth: true,
        lineStyle: {
          type: 'dashed',
          color: '#888'
        },
        data: predicted
      }
    ]
  })
}

onMounted(() => {
  salaryData = getSalaryData()
  updateStackedChart()
  updateLineChart()
})
</script>

<template>
<div class="trend-page">
  <div ref="stackedChartRef" style="width: 100%; height: 40vh; margin-bottom: 5vh; margin-top: 5vh;"></div>
  <div ref="lineChartRef" style="width: 100%; height: 40vh;"></div>
</div>
</template>

<style scoped>

.trend-page {
  width: 100%;
}

</style>