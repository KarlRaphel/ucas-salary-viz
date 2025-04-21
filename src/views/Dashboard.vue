<script setup>
import { onMounted, ref } from "vue";
import { getCurrentDate } from "@/scripts/time-utils.js";
import { sortDate, partMap, getSalaryData } from "@/scripts/data-utils.js";
import * as echarts from "echarts";

const chartRef = ref(null);

let salaryData;
let lastData;

function getEmptyData() {
  return {
    cas: 0,
    inst: 0,
    govt: 0,
    ra: 0,
    job: 0,
    bonus: 0,
    perf: 0,
    other: 0,
  };
}

const chartRangeOptions = [
  {
    value: "last-month",
    label: "最近一个月",
  },
  {
    value: "last-quarter",
    label: "最近三个月",
  },
  {
    value: "last-half-year",
    label: "最近六个月",
  },
  {
    value: "last-year",
    label: "最近一年",
  },
  {
    value: "all",
    label: "全部",
  },
];
const chartRange = ref("last-month");

const monthSummary = ref("无记录，请添加数据");
const quarterSum = ref("记录小于3个月，无法计算季度数据");
const halfYearSum = ref("记录小于6个月，无法计算半年数据");
const quarterCompare = ref("记录小于6个月，无法计算季度环比增长");
const yearCompare = ref("记录小于15个月，无法计算季度同比增长");
const totalIncome = ref("无记录，请添加数据");

function getSumData(num) {
  let sumData = getEmptyData();
  for (let i = 0; i < num; i++) {
    const data = salaryData[i];
    for (const key in sumData) {
      sumData[key] += data[key];
    }
  }
  return sumData;
}

function updateChart() {
  let chartData;
  if (chartRange.value === "last-month") {
    chartData = salaryData[0];
  } else if (chartRange.value === "last-quarter") {
    chartData = getSumData(3);
  } else if (chartRange.value === "last-half-year") {
    chartData = getSumData(6);
  } else if (chartRange.value === "last-year") {
    chartData = getSumData(12);
  } else {
    chartData = getSumData(salaryData.length);
  }
  const pieData = Object.entries(chartData)
    .filter(([key, value]) => key !== "total" && key !== "date" && value > 0)
    .map(([key, value]) => ({
      name: partMap[key] || key,
      value,
    }));

  const chart = echarts.init(chartRef.value);
  chart.setOption({
    title: {
      text: "收入分布",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "组成部分",
        type: "pie",
        radius: "60%",
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });
}

function updateMonthSummary() {
  if (salaryData.length < 1) {
    return;
  }
  const lastDate = lastData.date;
  let text = lastDate === getCurrentDate() ? "本月" : lastDate;
  text += "的工资总计：";
  text += lastData.total.toFixed(1);
  text += "元";
  monthSummary.value = text;
}

function updateQuarterSum() {
  if (salaryData.length < 3) {
    return;
  }
  let a = 0;
  for (let i = 0; i < 3; i++) {
    a += salaryData[i].total;
  }
  let text = "最近季度的工资平均：";
  text += (a / 3).toFixed(1);
  text += "元/月";
  quarterSum.value = text;
}

function updateHalfYearSum() {
  if (salaryData.length < 6) {
    return;
  }
  let a = 0;
  for (let i = 0; i < 6; i++) {
    a += salaryData[i].total;
  }
  let text = "最近半年的工资平均：";
  text += (a / 6).toFixed(1);
  text += "元/月";
  halfYearSum.value = text;
}

function updateQuarterCompare() {
  if (salaryData.length < 6) {
    return;
  }
  let a = 0;
  for (let i = 0; i < 3; i++) {
    a += salaryData[i].total;
  }
  let b = 0;
  for (let i = 3; i < 6; i++) {
    b += salaryData[i].total;
  }
  let text = "季度工资环比：";
  if (b > a) {
    text += "跌幅";
    text += (((b - a) / a) * 100).toFixed(1);
    text += "%";
  } else {
    text += "涨幅";
    text += (((a - b) / a) * 100).toFixed(1);
    text += "%";
  }
  quarterCompare.value = text;
}

function updateYearCompare() {
  if (salaryData.length < 15) {
    return;
  }
  let a = 0;
  for (let i = 0; i < 3; i++) {
    a += salaryData[i].total;
  }
  let b = 0;
  for (let i = 12; i < 15; i++) {
    b += salaryData[i].total;
  }
  let text = "季度工资同比：";
  if (b > a) {
    text += "跌幅";
    text += (((b - a) / a) * 100).toFixed(1);
    text += "%";
  } else {
    text += "涨幅";
    text += (((a - b) / a) * 100).toFixed(1);
    text += "%";
  }
  yearCompare.value = text;
}

function updateTotalIncome() {
  if (salaryData.length < 1) {
    return;
  }
  let a = 0;
  for (let i = 0; i < salaryData.length; i++) {
    a += salaryData[i].total;
  }
  let text = "目前工资总计已达：";
  text += a.toFixed(1);
  text += "元/";
  text += salaryData.length;
  text += "月";
  totalIncome.value = text;
}

onMounted(() => {
  salaryData = sortDate(getSalaryData(), false);
  lastData = salaryData[0];

  updateMonthSummary();
  updateQuarterSum();
  updateHalfYearSum();
  updateQuarterCompare();
  updateYearCompare();
  updateTotalIncome();

  updateChart();
});
</script>

<template>
  <div class="board-page">
    <div class="board-text">
      <div>{{ monthSummary }}</div>
      <div>{{ quarterSum }}</div>
      <div>{{ halfYearSum }}</div>
      <div>{{ quarterCompare }}</div>
      <div>{{ yearCompare }}</div>
      <div>{{ totalIncome }}</div>
    </div>
    <div class="board-chart">
      <div>
        <el-select
          v-model="chartRange"
          placeholder="请选择"
          @change="updateChart"
          class="chart-option"
        >
          <el-option
            v-for="item in chartRangeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div ref="chartRef" style="width: 100%; height: 80vh"></div>
    </div>
  </div>
</template>

<style scoped>
.board-page {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 80vh;
  margin-top: 5vh;
}

.board-text {
  width: 50%;
  text-align: center;
  font-weight: bold;
  font-size: 3vh;
  line-height: 5vh;
}

.chart-option {
  width: 30%;
  margin-bottom: 1vh;
}

.board-chart {
  width: 50%;
}
</style>
