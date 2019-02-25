<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page.sync="currentPage"
    :page-size="pageSize"
    background
    layout="prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</template>

<script>
  export default {
    name: "to-page",
    data() {
      return {
        currentPage: 1
      }
    },
    props: {
      pageSize: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 0
      },
    },
    methods: {
      handleSizeChange(val) {
        this.$emit('sentPages', val);
      },
      handleCurrentChange(val) {
        this.$emit('sentPages', val);
      },
      setCurrentPage() {
        this.currentPage = 1;
      }
    },
  }
</script>

<style scoped>

</style>
