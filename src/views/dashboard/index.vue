<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <span style="float: left;height: 40px;line-height: 40px;font-size: 17px;color: #080808;">小程序管理</span> -->
      <el-date-picker
        v-model="search.time"
        type="date"
        style="width: 150px;border-radius:14px !important;"
        value-format="yyyy-MM-dd"
        placeholder="选择提交时间"
      ></el-date-picker>
      <el-select
        v-model="search.auditStatus"
        style="width: 150px;border-radius:14px !important;"
        class="filter-item"
        placeholder="审核状态"
      >
        <el-option
          v-for="item in settletypeOptions"
          :key="item.key"
          label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-input
        style="width: 200px;border-radius:14px !important;"
        class="filter-item"
        placeholder="请输入项目单位名称"
        v-model="search.name"
      ></el-input>
      <el-button class="filter-item" type="primary">查询</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="margin-top: 15px;"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="提交时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.wxNickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信ID" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.wxPersonId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目单位" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.serveCompanyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ reStatus[scope.row.auditStatus]}}</span>
        </template>
      </el-table-column>

      <el-table-column label="详情" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            plain
            style="color: #7FB3EF;border: 1px solid #7FB3EF;"
            size="mini"
            @click="handleUpdate(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:15px;text-align: right;">
      <el-button type="primary" plain size="medium">一键发送红包</el-button>
    </div>
    <div class="pagination-container" style="margin-top: 10px;text-align: center">
      <el-pagination
        :current-page="search.page"
        :page-sizes="[20,30,50,100]"
        :page-size="search.pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="查看审核" :visible.sync="dialogFormVisible" style="min-width: 600px;">
      <div class="dialogTitle clearfix">
        <div class="titleleft">值机项目单位名称</div>
        <div class="titleright">提交人微信ID：{{temp.wxPersonId}}</div>
      </div>
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="90px"
        size="mini"
        style="border: 1px solid #7FB3EF;padding: 10px;"
        class="clearfix"
      >
        <el-form-item label="单位名称：">
          <el-input v-model="temp.serveCompanyName" placeholder="单位名称" :disabled="temp.redPackageStatus==1"></el-input>
        </el-form-item>
        <el-form-item label="单位地址：">
          <el-input v-model="temp.companyAddress" placeholder="单位地址" :disabled="temp.redPackageStatus==1"></el-input>
        </el-form-item>
        <el-form-item label="建筑类型：" style="margin-right: 100px;">
          <el-radio-group v-model="temp.buildingType" :disabled="temp.redPackageStatus==1">
            <el-radio label="1">单多层建筑</el-radio>
            <el-radio label="2">高层建筑</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="负责人姓名：">
          <el-input v-model="temp.managerName" placeholder="负责人姓名" :disabled="temp.redPackageStatus==1"></el-input>
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="temp.managerPhone" placeholder="电话" :disabled="temp.redPackageStatus==1"></el-input>
        </el-form-item>
        <el-form-item label="所在部门：">
          <el-input v-model="temp.department" placeholder="所在部门" :disabled="temp.redPackageStatus==1"></el-input>
        </el-form-item>
        <el-form-item label="职务：">
          <el-input v-model="temp.profession" placeholder="职务" :disabled="temp.redPackageStatus==1"></el-input>
        </el-form-item>
        <el-form-item label="其他负责人：">
          <el-input v-model="temp.otherManager" placeholder="其他负责人" :disabled="temp.redPackageStatus==1"></el-input>
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="temp.otherManagerPhone" placeholder="电话" :disabled="temp.redPackageStatus==1"></el-input>
        </el-form-item>
        <el-form-item label="项目合同开始时间：">
          <el-date-picker
            v-model="temp.pactBeginTime"
            type="date"
            style="width: 230px;border-radius:14px !important;"
           :disabled="temp.redPackageStatus==1"
            placeholder="项目合同开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="项目合同结束时间：">
          <el-date-picker
            v-model="temp.pactFinishTime"
            type="date"
            style="width: 230px;border-radius:14px !important;"
             :disabled="temp.redPackageStatus==1"
            placeholder="项目合同结束时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialogTitle clearfix">
        <div class="titleleft">项目任用单位信息</div>
      </div>
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="90px"
        size="mini"
        style="border: 1px solid #7FB3EF;padding: 10px;"
        class="clearfix"
      >
        <el-form-item label="单位名称：">
          <el-input v-model="temp.hireCompanyName" placeholder="单位名称" :disabled="temp.redPackageStatus==1"></el-input>
        </el-form-item>
        <el-form-item label="服务年限" class="gs">
          <el-input v-model="temp.serveYears" placeholder="服务年限" :disabled="temp.redPackageStatus==1"></el-input>
          <span class="gstext">年</span>
        </el-form-item>
        <el-form-item label="合作类型：">
          <el-radio-group v-model="temp.cooperationType" :disabled="temp.redPackageStatus==1">
            <el-radio label="1">单位直招</el-radio>
            <el-radio label="2">外包</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="岗位类型：">
          <el-radio-group v-model="temp.stationType" :disabled="temp.redPackageStatus==1">
            <el-radio label="1">单岗</el-radio>
            <el-radio label="2">双岗</el-radio>
            <el-radio label="3">三岗以上</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="福利情况">
          <el-checkbox-group v-model="temp.welfareSituation" :disabled="temp.redPackageStatus==1">
            <el-checkbox label="1">包吃</el-checkbox>
            <el-checkbox label="2">包住</el-checkbox>
            <el-checkbox label="3">其他</el-checkbox>
          </el-checkbox-group>
          <el-input v-model="temp.welfareElse" placeholder="其它福利" :disabled="temp.redPackageStatus==1"></el-input>
        </el-form-item>
        <el-form-item label="每班薪资：" class="gs">
          <el-input v-model="temp.oncePay" placeholder="每班薪资" :disabled="temp.redPackageStatus==1"></el-input>
          <span class="gstext">元</span>
        </el-form-item>
        <el-form-item label="每班工时" class="gs">
          <el-radio-group v-model="temp.workingHours" :disabled="temp.redPackageStatus==1">
            <el-radio label="1">8小时</el-radio>
            <el-radio label="2">12小时</el-radio>
            <el-radio label="3">16小时</el-radio>
            <el-radio label="4">24小时</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="每月薪资：" class="gs">
          <el-input v-model="temp.monthPay" placeholder="每月薪资" :disabled="temp.redPackageStatus==1"></el-input>
          <span class="gstext">元</span>
        </el-form-item>
        <el-form-item label="值机总人数：" class="gs">
          <el-input v-model="temp.workPersonTotal" placeholder="值机总人数" :disabled="temp.redPackageStatus==1"></el-input>
          <span class="gstext">人</span>
        </el-form-item>
        <el-form-item label="有证值机员：" class="gs">
          <el-input v-model="temp.certificateCount" placeholder="有证值机员" :disabled="temp.redPackageStatus==1"></el-input>
          <span class="gstext">人</span>
        </el-form-item>
        <el-form-item label="无证值机员：" class="gs">
          <el-input v-model="temp.noCertificateCount" placeholder="无证值机员" :disabled="temp.redPackageStatus==1"></el-input>
          <span class="gstext">人</span>
        </el-form-item>
      </el-form>
      <div class="dialogTitle clearfix">
        <div class="titleleft">提交人信息</div>
      </div>
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="115px"
        size="mini"
        style="border: 1px solid #7FB3EF;padding: 10px;"
        class="clearfix form3"
      >
        <el-form-item label="提交人姓名：">
          <el-input v-model="temp.wxNickName" placeholder="提交人姓名" disabled></el-input>
        </el-form-item>
        <el-form-item label="绑定微信的手机：">
          <el-input v-model="temp.wxNum" placeholder="绑定微信的手机" disabled></el-input>
        </el-form-item>
      </el-form>
      <div class="checkred">
        <el-checkbox v-model="isTrue" :disabled="temp.redPackageStatus==1" @change="isTrueChange">可发红包</el-checkbox>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from "@/api/table";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      total: 0,
      temp: {
        serveCompanyName: "",
        companyAddress: "",
        buildingType: 1,
        managerName: "",
        managerPhone: "",
        department: "",
        profession: "",
        otherManager: "",
        otherManagerPhone: "",
        pactBeginTime: "",
        pactFinishTime: "",
        hireCompanyName: "",
        cooperationType: "",
        serveYears: "",
        stationType: 1,
        welfareSituation: [],
        welfareElse: "",
        workingHours: 1,
        oncePay: "",
        monthPay: "",
        workPersonTotal: 0,
        certificateCount: 0,
        noCertificateCount: 0,
        wxNickName: "",
        wxNum: ""
      },
      isTrue: false,
      search: {
        // name: "",
        // auditStatus: 3,
        page: 1,
        pageSize: 50
      },
      settletypeOptions: [
        { label: "全部", key: 3 },
        { label: "未审核", key: 0 },
        { label: "审核通过", key: 1 },
        { label: "审核不通过", key: 2 }
      ],
      reStatus: ["未审核", "审核通过", "审核不通过"]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList(this.search).then(response => {
        this.list = response.resultData.personList.map(item=>{
          item.welfareSituation=item.welfareSituation.split(",")
          return item;
        });
        this.total = response.resultData.pageInfo.totalCounts;
        this.listLoading = false;
      });
    },
    handleUpdate(row) {
      this.dialogFormVisible = true;
      this.temp = Object.assign({},row);
      if(this.temp.redPackageStatus==0){
        this.isTrue = false;
      }else if(this.temp.redPackageStatus==1){
        this.isTrue = true;
      }
    },
    isTrueChange(e){
      if(e){
        this.temp.redPackageStatus = 1;
      }else{
        this.temp.redPackageStatus = 0;
      }
    },
    updateData(){
      this.dialogFormVisible = false;
    },
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.search.page = val;
      this.fetchData();
    }
  }
};
</script>
<style>
.filter-container {
  text-align: right;
}
.dialogTitle {
  height: 30px;
  line-height: 30px;
}
.titleleft {
  height: 30px;
  line-height: 30px;
  float: left;
}
.titleright {
  height: 30px;
  line-height: 30px;
  float: right;
}
.el-dialog {
  width: 50%;
  min-width: 750px !important;
}
.el-form-item {
  margin-bottom: 10px !important;
  float: left;
  overflow: hidden;
}
.el-form-item__label {
  padding: 0;
}
.form3 .el-form-item__content {
  width: 205px;
}
.el-form-item__content {
  width: 230px;
  margin-right: 10px;
  /* height: 35px;
  line-height: 35px; */
}
.el-radio + .el-radio {
  margin-left: 10px !important;
}
.el-radio__label {
  font-size: 14px;
  padding-left: 10px !important;
}
.el-checkbox__label {
  padding-left: 5px !important;
}
.el-checkbox + .el-checkbox {
  margin-left: 10px !important;
}
.gs .el-radio {
  float: left;
  margin-right: 10px;
  width: 40%;
}
.gstext {
  display: inline-block;
  width: 10%;
  text-align: center;
}
.gs .el-input {
  width: 86% !important;
}
.gs .el-radio + .el-radio {
  margin-left: 0px !important;
}
.checkred {
  text-align: right;
  margin-top: 15px;
}
.checkred .el-checkbox__label {
  font-weight: 600;
  font-size: 16px;
}
</style>

