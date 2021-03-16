<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card
        shadow="never"
        style="margin-left: 0px; margin-bottom: 30px; margin-top: 10px"
      >
        <i class="el-icon-tickets" />
        <span style="font-size:14px;margin-left:10px">数据列表</span>
      </el-card>
    </div>

    <!-- 表格数据 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :header-cell-style="getRowClass"
      :default-sort="{ prop: 'DisplayOrder', order: 'ascending' }"
      @sort-change="sortChange"
      @selection-change="SelectChange"
    >
      <el-table-column
        type="selection"
        width="65"
        align="center"
      />

      <el-table-column
        prop="orderAccountId"
        label="下单帐号"
        min-width="170px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.orderAccountId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderMoney"
        label="总计"
        min-width="170px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.orderMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        min-width="170px"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.type !== '' && row.type === 'Shopping'">
            <span>购物订单</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleDetail(row,$index)">
            订单明细
          </el-button>
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件: -->
    <div class="pagination-container">
      <el-pagination
        v-show="total > 0"
        background
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.PageSize"
        :current-page.sync="listQuery.PageIndex"
        :page-sizes="[10, 15, 20]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList" /> -->
    <!-- fullscreen  -->
    <el-dialog
      ref="print"
      width="70%"
      style="height: 100%; float: right"
      :title="textMap[dialogStatus]"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
      >
        <p class="word-v-middle" style="margin-bottom:50px;">
          <span style="font-size: 22px">智慧酒店商城订单信息</span>
        </p>
        <div v-if="temp !== null && temp.createTime!==null" class="div-inline">订单帐号:   {{ temp.orderAccountId }}</div>
        <div v-if="temp !== null && temp.createTime!==null" class="div-inline">订单编号:   {{ temp.id }}</div>
        <div v-if="temp.payWay !== null && temp.payWay ==='WeChatPay'" class="div-inline">
          支付方式:     微信支付
        </div>
        <div v-else-if="temp.payWay !== null && temp.payWay ==='AliPay'" class="div-inline">
          支付方式:     支付宝
        </div>
        <div v-if="temp !== null && temp.createTime!==null" class="div-inline">付款时间:   {{ temp.createTime }}</div><p style="margin:25px" /><p style="margin:25px" />
        <div v-if="temp !== null && temp.type !== null" class="div-inline">类型:   购物订单</div>
        <div v-if="temp !== null && temp.createTime!==null" class="div-inline">支付金额:   {{ temp.payMoney }}</div>
        <div v-if="temp !== null && temp.createTime!==null" class="div-inline">定金:   {{ temp.orderMoney }}</div>
        <div v-if="temp !== null && temp.createTime!==null" class="div-inline">下单时间:   {{ temp.createTime }}</div><p style="margin:25px" />

        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="detailList"
          border
          fit
          highlight-current-row
          style="width: 100%"
          :header-cell-style="getRowClass"
          :default-sort="{ prop: 'DisplayOrder', order: 'ascending' }"
          @sort-change="sortChange"
          @selection-change="SelectChange"
        >
          <el-table-column
            prop="orderAccountId"
            label="订单名称"
            min-width="170px"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.commodityName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="payMoney"
            label="价格(￥)"
            min-width="170px"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderMoney"
            label="数量(件)"
            min-width="170px"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderMoney"
            label="小计(￥)"
            min-width="170px"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.quantity * row.price }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer" style="align: center">
        <el-button @click="printContext"> 打印 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getList, createInfo, updateInfo } from '@/api/medical'
import axios from 'axios'
import QS from 'qs'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { PostUpload, orderlist, orderdetail } from '@/api/order' // 导入我们的api接口
import { getToken, setToken, removeToken } from '@/utils/auth'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: {
    waves,
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function(el) {
        el.addEventListener('keypress', function(e) {
          e = e || window.event
          const charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode
          const re = /\d/
          if (
            !re.test(String.fromCharCode(charcode)) &&
            charcode > 9 &&
            !e.ctrlKey
          ) {
            if (e.preventDefault) {
              e.preventDefault()
            } else {
              e.returnValue = false
            }
          }
        })
      }
    }
  },
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      temp: {
        id: '', // 订单ID
        status: '', // 订单状态
        orderMoney: '', // 定金
        payWay: '', // 支付方式
        payMoney: '', // 支付金额
        payTime: '', // 支付时间
        type: '', // 类型
        orderAccountId: '', // 订单帐号
        creator: '', // 创建者
        createTime: '', // 创建时间
        updater: '', // 更新者
        updateTime: '' // 更新时间
      },
      tableKey: 0, // table的key
      listLoading: false, // 加载
      list: [], // 请求回来填充表格的数据
      detailList: [], // 订单明细列表
      total: 0, // 总页数
      listQuery: {
        PageIndex: 1,
        PageSize: 20,
        SortName: 'CreateTime',
        SortType: 'ASC'
      },
      calendarTypeOptions,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '订单明细'
      },
      rules: {
        DisplayOrder: [
          {
            required: true,
            message: '展示序号不能为空',
            trigger: 'blur,change'
          }
        ]
      }
    }
  },
  created() {
    this.getList() // 获取列表数据
  },
  methods: {
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F5F7FA'
      } else {
        return ''
      }
    },
    // 打印功能
    printContext() {
      this.$print(this.$refs.print)
    },

    handleDetail(row, index) {
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      // this.$refs["dataForm"].clearValidate();
      // });
      this.dialogStatus = 'detail'
      console.log(row.id)
      this.getDetail(row.id) // 执行订单明细方法
    },

    // 获取订单列表数据
    getList() {
      var start = (this.PageIndex - 1) * this.limit
      var end = this.PageIndex * this.limit
      // 调用api接口，并且提供了两个参数
      this.listLoading = true
      // debugger
      orderlist({
        PageSize: this.listQuery.PageSize,
        PageIndex: this.listQuery.PageIndex,
        SortName: this.listQuery.SortName,
        SortType: this.listQuery.SortType
      })
        .then((res) => {
          // 获取数据成功后的其他操作
          // debugger
          this.list = res.data
          // this.getAdjustSort(this.list)
          const start = this.PageIndex * this.pageSize
          const end = Math.min(
            (this.PageIndex + 1) * this.pageSize,
            this.list.length
          )
          this.total = res.total
          console.log(res)
          this.listLoading = false

          // this.list = response.data.items
        })
        .catch(function(error) {
          console.log(error)
          // this.listLoading = false;
        })
    },

    // 获取订单明细数据
    getDetail(id) {
      var start = (this.PageIndex - 1) * this.limit
      var end = this.PageIndex * this.limit
      // 调用api接口，并且提供了两个参数
      this.listLoading = true
      // debugger
      orderdetail(id)
        .then((res) => {
          // 获取数据成功后的其他操作
          // debugger
          // this.list = res.data;
          // this.getAdjustSort(this.list)
          console.log('----------订单明细----------')
          console.log(res)
          this.detailList = res.data1
          this.temp = res.data
          const start = this.PageIndex * this.pageSize
          const end = Math.min(
            (this.PageIndex + 1) * this.pageSize,
            this.list.length
          )
          this.total = res.total
          console.log(res)
          this.listLoading = false

          // this.list = response.data.items
        })
        .catch(function(error) {
          console.log(error)
          // this.listLoading = false;
        })
    },

    // 字体改变
    handleSizeChange(val) {
      this.listQuery.PageIndex = 1
      this.listQuery.PageSize = val
      this.getList()
    },
    // 分页
    handleCurrentChange(val) {
      this.listQuery.PageIndex = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.PageIndex = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.SortName = '+id'
      } else {
        this.listQuery.SortName = '-id'
      }
      this.handleFilter()
    },
    // 选中的数据
    SelectChange(val) {
      this.dellist = val
      console.log(this.dellist)
    },
    getSortClass: function(key) {
      const SortName = this.listQuery.SortName
      return SortName === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style scoped>

.div-inline {
  display:inline-block;
  margin: auto 50px;
  text-align: center;
  font-size: 15px;
  vertical-align:middle;
}
.word-v-middle {
  margin-bottom: 0;
  font-size: 12px;
  min-height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 31px;
  margin-top: 5px;
  color: #87878a;
  white-space: normal;
}

.word-v-middle span {
  text-align: left;
  font-size: 10px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.dialog-fade-enter-active .el-dialog.way {
  animation: anim-open 0.3s;
}
.dialog-fade-leave-active .el-dialog.way {
  animation: anim-close 0.3s;
}
@keyframes anim-open {
  0% {
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes anim-close {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }
}
</style>
