<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <el-form :model="codeForm">
      <el-form-item label="">
        <el-input v-model="code" placeholder="请输入提取码"></el-input>
      </el-form-item>
      <el-form-item label="" style="margin-top:10px;">
        <el-button type="primary">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  data() {
    return {
      codeForm: {
        code: ''
      }
    }
  },
};
</script>

<style lang="stylu" scoped>
  
</style>
