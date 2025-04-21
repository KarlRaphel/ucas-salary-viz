<template>
<el-col :span="span" class="detail-block">
  <el-button :type="type" @click="click" class="detail-button">{{ text }}</el-button>
</el-col>
</template>

<script setup>
defineProps({
  span: {
    type: Number,
    default: 4
  },
  type: {
    type: String,
    default: 'info'
  },
  click: {
    type: Function,
    default: () => {}
  },
  text: {
    type: String,
    default: ''
  }
})

</script>

<style scoped>

.detail-block {
  text-align: center;
}

.detail-button {
  width: 40%;
}

</style>