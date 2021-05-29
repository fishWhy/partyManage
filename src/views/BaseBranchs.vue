<template>
    <div class="common-layout">
        <el-container>
          <el-header style="height:20px;margin:0;">支部信息</el-header>
          <el-main>

            <el-table
            :data="tableData"
            style="width: 100%"
            id="branchTable314"
            size="small"
            >

                <el-table-column
                  prop="branch"
                  label="支部名称"
                  width="150"
                  align="center">
                </el-table-column>

                <el-table-column
                  label="本科"
                  width="150"
                  align="center">
                    <el-table-column
                      prop="regCandidate"
                      label="预备党员"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="reParty"
                      label="正式党员"
                      align="center">
                    </el-table-column>
                </el-table-column>

                <el-table-column
                  label="研究生"
                  width="150"
                  align="center">
                    <el-table-column
                      prop="graCandidate"
                      label="预备党员"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="graParty"
                      label="正式党员"
                      align="center">
                    </el-table-column>
                </el-table-column>

                <el-table-column
                  label="博士"
                  width="150"
                  align="center">
                    <el-table-column
                      prop="docCandidate"
                      label="预备党员"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="docParty"
                      label="正式党员"
                      align="center">
                    </el-table-column>
                </el-table-column>

                <el-table-column
                  prop="actv"
                  label="积极分子"
                  align="center">
                </el-table-column>

                <el-table-column
                  prop="leader"
                  label="支部书记"
                  align="center">
                </el-table-column>

                <!-- <el-table-column label="操作" align="center">
                  <template #default="scope">
                      <el-button
                          type="text"
                          icon="el-icon-edit"
                          @click="handleDetail(scope.$index, scope.row)"
                      >详情</el-button>
                  </template>
                </el-table-column> -->

            </el-table>

          </el-main>
        </el-container>
    </div>
</template>

<script>
import {getBranchsData} from '../api/index.js'
export default {
    name: 'baseBranchs',
    created(){
      this.getData();
    },
    activated(){
        this.getData();
    },
    data() {
        return {
          tableData:[],
        };
    },
    methods:{
      getData(){
        this.tableData = getBranchsData();
      },
      handleDetail:function(index, row){
        console.log(row);
      }
    }
};
</script>

<style scoped>
#branchTable314 .el-table__header tr{
  color: red;
}

</style>

<style>
/* #branchTable314 {
  outline: 1px solid red;
} */

/* .el-table__header tr{ */
  /* height: 40px;
  padding: 0px; */
  /* color: red; */
  /* outline: 1px solid blue; */
/* }  */

/* #branchTable314 .el-table__header thead tr,
#branchTable314 .el-table__header thead{
  /* height: 40px; */
  /* padding: 0px; */
  /* color: red;
} */ 

</style>
