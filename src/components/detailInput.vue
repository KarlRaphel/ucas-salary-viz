<template>
<el-col :span="span" class="detail-block">
  <span class="current-label">{{ label }}：</span>
  <el-input
    :model-value="modelValue"
    @input="$emit('update:modelValue', $event)"
    class="current-input"
  />
</el-col>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: String, // 用于接收 v-model 绑定值
  span: {
    type: Number,
    default: 4
  }
})

defineEmits(['update:modelValue']) // 必须定义这个事件用于触发 v-model 的更新
</script>

<style scoped>

.detail-block {
  text-align: center;
  margin-bottom: 10px;
}

.current-label {
  display: inline-block;
  width: 80px;
}

.current-input {
  width: 120px;
}
</style>