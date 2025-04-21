<script setup>
import { DataAnalysis, Odometer, EditPen } from "@element-plus/icons-vue";
import router from "@/router.js";

router.push("/dashboard");
</script>

<template>
  <div class="home-page">
    <div class="title-bar">工资记录分析 V1.0.0</div>
    <div class="main-view-with-menu">
      <el-menu :router="true" default-active="/dashboard" class="side-bar">
        <el-menu-item index="/dashboard" class="menu-item">
          <el-icon><Odometer /></el-icon>
          看板
        </el-menu-item>
        <el-menu-item index="/trend" class="menu-item">
          <el-icon><DataAnalysis /></el-icon>
          趋势
        </el-menu-item>
        <el-menu-item index="/detail" class="menu-item">
          <el-icon><EditPen /></el-icon>
          详情
        </el-menu-item>
      </el-menu>
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.title-bar {
  background-color: #0095ce;
  height: 8vh;
  width: 99%;
  color: white;
  font-size: 3vh;
  font-weight: bold;
  line-height: 8vh;
  padding-left: 1vw;
}

.main-view-with-menu {
  display: flex;
  width: 100%;
  height: 92vh;
}

.side-bar {
  width: 8%;
  font-weight: bold;
}

.menu-item {
  text-align: center;
  font-size: 2vh;
}
</style>
