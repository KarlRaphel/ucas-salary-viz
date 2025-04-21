<script setup>
import { ref, onMounted } from "vue";
import { getCurrentDate } from "@/scripts/time-utils.js";
import DetailInput from "@/components/detailInput.vue";
import DetailButton from "@/components/detailButton.vue";
import { ElMessage } from "element-plus";
import {
  sortDate,
  getSampleData,
  getSalaryData,
  upsertSalaryRecord,
} from "@/scripts/data-utils.js";

const currentDate = ref("");
const currentCas = ref(0);
const currentInst = ref(0);
const currentGovt = ref(0);
const currentRa = ref(0);
const currentJob = ref(0);
const currentBonus = ref(0);
const currentPerf = ref(0);
const currentOther = ref(0);
const salaryData = ref([]);
const isHighlighted = ref(false);

function logCurrent() {
  console.log(currentCas.value);
}

const saveJson = () => {
  const dataStr = JSON.stringify(sortDate(salaryData.value), null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "salary-data.json"; // 下载文件名
  link.click();

  URL.revokeObjectURL(url);
};

onMounted(() => {
  currentDate.value = getCurrentDate();
  salaryData.value = sortDate(getSalaryData(), false);
  const nearestData = salaryData.value[0];
  currentCas.value = nearestData.cas;
  currentInst.value = nearestData.inst;
  currentGovt.value = nearestData.govt;
  currentRa.value = nearestData.ra;
  currentJob.value = nearestData.job;
  currentBonus.value = nearestData.bonus;
  currentPerf.value = nearestData.perf;
  currentOther.value = nearestData.other;
});

const fileInput = ref(null);

const triggerFileSelect = () => {
  fileInput.value?.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file || file.type !== "application/json") {
    ElMessage.error("请选择一个 JSON 文件");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      salaryData.value = sortDate(parsed, false);
      ElMessage.success("文件读取成功");
      const sorted = sortDate(parsed, true);
      localStorage.setItem("salaryData", JSON.stringify(sorted));
    } catch (err) {
      ElMessage.error("JSON 文件解析失败");
    }
  };
  reader.readAsText(file);
};

function getValue(value) {
  return Number(value) ? Number(value) : 0;
}

function updateRecord() {
  if (!currentDate.value) {
    ElMessage.error("请选择日期");
    return;
  }
  const casValue = getValue(currentCas.value);
  const instValue = getValue(currentInst.value);
  const govtValue = getValue(currentGovt.value);
  const raValue = getValue(currentRa.value);
  const jobValue = getValue(currentJob.value);
  const bonusValue = getValue(currentBonus.value);
  const perfValue = getValue(currentPerf.value);
  const otherValue = getValue(currentOther.value);
  const totalValue =
    casValue +
    instValue +
    govtValue +
    raValue +
    jobValue +
    bonusValue +
    perfValue +
    otherValue;

  const newRecord = {
    date: currentDate.value,
    cas: casValue,
    inst: instValue,
    govt: govtValue,
    ra: raValue,
    job: jobValue,
    bonus: bonusValue,
    perf: perfValue,
    other: otherValue,
    total: totalValue,
  };

  const newData = upsertSalaryRecord(newRecord, salaryData.value);
  salaryData.value = sortDate(newData, false);
  localStorage.setItem("salaryData", JSON.stringify(newData));
}

function modifyRecord(row) {
  currentDate.value = row.date;
  currentCas.value = row.cas;
  currentInst.value = row.inst;
  currentGovt.value = row.govt;
  currentRa.value = row.ra;
  currentJob.value = row.job;
  currentBonus.value = row.bonus;
  currentPerf.value = row.perf;
  currentOther.value = row.other;

  isHighlighted.value = true;
  setTimeout(() => {
    isHighlighted.value = false;
  }, 1000);
}

function deleteRecord(row) {
  const newData = salaryData.value.filter((item) => item.date !== row.date);
  salaryData.value = sortDate(newData, false);
  localStorage.setItem("salaryData", JSON.stringify(newData));
}
</script>

<template>
  <div class="detail-page">
    <div class="edit-panel" :class="isHighlighted ? 'highlight' : ''">
      <el-row>
        <DetailInput label="当前日期" v-model="currentDate" />
        <DetailInput label="国科大" v-model="currentCas" />
        <DetailInput label="研究所" v-model="currentInst" />
        <DetailInput label="国家" v-model="currentGovt" />
        <DetailInput label="助研" v-model="currentRa" />
        <DetailInput label="兼职" v-model="currentJob" />
      </el-row>
      <el-row>
        <DetailInput label="奖金" v-model="currentBonus" />
        <DetailInput label="绩效" v-model="currentPerf" />
        <DetailInput label="其他" v-model="currentOther" />
        <DetailButton type="primary" :click="updateRecord" text="新增/修改" />
        <DetailButton :click="saveJson" text="导出备份" />
        <DetailButton :click="triggerFileSelect" text="导入备份" />
        <input
          type="file"
          ref="fileInput"
          accept=".json"
          style="display: none"
          @change="handleFileChange"
        />
      </el-row>
    </div>
    <div class="table-panel">
      <el-table :data="salaryData" border stripe height="73vh">
        <el-table-column
          prop="date"
          label="日期"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          prop="cas"
          label="国科大"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          prop="inst"
          label="研究所"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          prop="govt"
          label="国家"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          prop="ra"
          label="助研"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          prop="job"
          label="兼职"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          prop="bonus"
          label="奖金"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          prop="perf"
          label="绩效"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          prop="other"
          label="其他"
          :sortable="true"
        ></el-table-column>
        <el-table-column
          prop="total"
          label="合计"
          :sortable="true"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              type="primary"
              plain
              @click="modifyRecord(scope.row)"
              size="small"
              >修改</el-button
            >
            <el-button
              type="danger"
              plain
              @click="deleteRecord(scope.row)"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90vh;
}

.edit-panel {
  align-items: center;
  padding: 1vw;
  transition: background-color 0.3s ease;
}

.highlight {
  background-color: #befaff; /* 浅黄 */
}

.table-panel {
  margin: 1vw;
}
</style>
