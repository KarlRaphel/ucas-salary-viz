import { getCurrentDate } from "@/scripts/time-utils.js";

export function sortDate(data, ascending = true) {
  return [...data].sort((a, b) => {
    return ascending
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date);
  });
}

export const partMap = {
  cas: "国科大",
  inst: "研究所",
  govt: "国家",
  ra: "助研",
  job: "兼职",
  bonus: "奖金",
  perf: "绩效",
  other: "其他",
};

export function getSampleSingleData(offset = 0) {
  return {
    date: getCurrentDate(offset),
    cas: 600,
    inst: 800,
    govt: 1500,
    ra: 1500,
    job: 100,
    bonus: 0,
    perf: 0,
    other: 0,
    total: 4500,
  };
}

export function getSampleData() {
  const data = [];
  for (let i = 0; i < 6; i++) {
    data.push(getSampleSingleData(5 - i));
  }
  return data;
}

export function getSalaryData() {
  let salaryData;
  const storageData = localStorage.getItem("salaryData");
  if (storageData) {
    salaryData = sortDate(JSON.parse(storageData));
  } else {
    salaryData = getSampleData();
  }
  return salaryData;
}

export function upsertSalaryRecord(newRecord, salaryData) {
  const index = salaryData.findIndex((item) => item.date === newRecord.date);

  if (index !== -1) {
    // ✅ 存在：更新该记录
    salaryData[index] = { ...salaryData[index], ...newRecord };
  } else {
    // ➕ 不存在：插入新记录
    salaryData.push(newRecord);
  }
  return sortDate(salaryData);
}
