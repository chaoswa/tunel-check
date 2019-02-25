<template>
  <div class="page">
    <el-pagination
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      background
      @current-change="handleCurrentChange"
      :total="pagesNum">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "page",
    data() {
      return {
        query: '...',
        currentPage: 1,
      }
    },
    computed: {
      page() {
        return Math.floor(this.pagesNum / this.pageSize)
      }
    },
    props: {
      pagesNum: {
        type: Number,
        default: 0
      },
      pageSize: {
        type: Number,
        default: 0
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.$emit('pageIndex', val);
      },
      setCurrentPage() {
        this.currentPage = 1;
      }
    }
  }
</script>

<style scoped lang="scss">
  .page {
    height: 36px;
    margin-top: 16px;
    float: right;
    line-height: 36px;
    font-size: 14px;
  }

</style>
