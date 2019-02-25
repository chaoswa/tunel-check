<template>
  <el-pagination
    small
    layout="prev, pager, next"
    :page-size="pageSize"
    :current-page.sync="currentPage"
    @current-change="handleCurrentChange"
    :total="pagesNum">
  </el-pagination>
</template>

<script>
  export default {
    data(){
      return {
        currentPage: 1
      }
    },
    computed:{
      page(){
        return Math.floor(this.pagesNum/this.pageSize)
      }
    },
    props:{
      pagesNum:{
        type:Number,
        default:0
      },
      pageSize:{
        type:Number,
        default:0
      }
    },
    methods:{
      handleCurrentChange(val){
        this.$emit('pageIndex',val);
      },
      setCurrentPage() {
        this.currentPage = 1;
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
