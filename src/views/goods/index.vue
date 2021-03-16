<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div> -->
    <div class="filter-container">
      <el-card
        shadow="never"
        style="margin-left: 0px; margin-bottom: 10px; margin-top: 0px"
      >
        <!-- <i class="el-icon-tickets"></i>
        <span>数据列表</span> icon="el-icon-delete"-->
        <el-button
          size="mini"
          class="btn-add"
          style="margin-left: 20px; border-color: blue"
          @click="handleCreate"
        >添加商品</el-button>
        <!-- <el-button
          size="mini"
          @click="deleteUserInfo()"
          style="margin-left: 20px; border-color: red"
          >批量删除</el-button
        > -->
      </el-card>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :header-cell-style="getRowClass"
      @sort-change="sortChange"
      @selection-change="SelectChange"
    >
      <el-table-column
        type="selection"
        width="65"
        align="center"
      />
      <el-table-column label="名称" align="center" min-width="170">
        <template slot-scope="{row}">
          <span class="link-type fontColor" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        min-width="170px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span class="link-type fontColor" @click="handleUpdate(row)">{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          label="封面: "
          prop="cover"
          multiple="multipart/form-data"
        >
          <el-upload
            v-if="dialogStatus === 'create'"
            ref="imgBroadcastUpload"
            :headers="headers"
            list-type="picture-card"
            :limit="1"
            multiple
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            accept=".jpg, .png"
            name="files"
            action="xxx"
            :file-list="fileList"
            :data="ruleForm"
          >
            <i class="el-icon-plus" />
            <!-- <img v-else :src="temp.coverUrl" width="145px" height="145px"/> -->
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2M
            </div>
          </el-upload>
          <el-upload
            v-else
            :headers="headers"
            class="avatar-uploader"
            action="xxx"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload"
            :data="ruleForm"
            name="files"
            accept=".png,.jpg"
          >
            <img
              v-if="temp.coverUrl"
              width="80px"
              height="80px"
              :src="temp.coverUrl"
              class="avatar"
            >
            <i
              v-else
              style="border: 1px dashed gray; padding: 30px"
              class="el-icon-plus"
            />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg,png文件，且不超过5M (点击图片可编辑)
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="temp.coverUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="价格: " prop="price">
          <el-input
            v-model.number="temp.price"
            step="0.01"
            type="number"
            oninput="value=value.replace(/[^\d.]/g,'')"
            placeholder="请输入价格"
          />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="temp.unit" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { goodslist, goodsadd, goodsedit } from '@/api/goods'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import axios from 'axios'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      dialogVisible: false, // 是否查看图片
      ruleForm: {
        Catalog: 'Commodity'
      },
      headers: {
        Accept: 'multipart/form-data'
        // Authorization: getToken(), //从cookie里获取token，并赋值  Authorization ，而不是token
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        'PageIndex': 1,
        'PageSize': 15,
        'SortName': 'CreateTime',
        'SortType': 'ASC'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        name: '', // 商品名称
        coverUrl: '', // 封面
        description: '', // 描述
        price: '', // 价格
        unit: '' // 单位
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        cover: [{ required: true, message: '封面不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 选中的数据
    SelectChange(val) {
      this.dellist = val
      console.log(this.dellist)
    },
    getList() {
      this.listLoading = true
      const listdata = {}
      listdata.PageIndex = 1
      listdata.PageSize = 15
      listdata.SortName = 'CreateTime'
      listdata.SortType = 'ASC'
      // test().then(response => {
      //   console.log(response);
      // })
      goodslist(listdata).then(response => {
        console.log(response)
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F5F7FA'
      } else {
        return ''
      }
    },
    // 上传图片前的事件
    beforeAvatarUpload(file) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isImg) {
        this.$message.error('上传图片只能是 JPG/JPEG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }

      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function() { // 让页面中的img标签的src指向读取的路径
        var img = new Image()
        img.src = reader.result
        if (img.complete) { // 如果存在浏览器缓存中
          if (img.width > 1400 || img.height > 1080) {
            this.$message.error('上传图片分辨率建议1400*1080,宽度不可超过1400px，高度不超过1080px!')
            return false
          }
        } else {
          img.onload = function() {
            if (img.width > 1400 || img.height > 1080) {
              this.$message.error('上传图片分辨率建议1400*1080,宽度不可超过1400px，高度不超过1080px!')
              return false
            }
          }
        }
      }

      return isImg && isLt2M
    },

    // 上传图片前的事件
    beforeAvatarUpload2(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      console.log(testmsg)
      const extension = testmsg === 'jpg'
      const extension2 = testmsg === 'png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!extension && !extension2) {
        alert('上传文件只能是 jpg、png格式!')
      }
      if (!isLt2M) {
        alert('上传文件大小不能超过 5MB!')
      }

      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function() { // 让页面中的img标签的src指向读取的路径
        var img = new Image()
        img.src = reader.result
        if (img.complete) { // 如果存在浏览器缓存中
          if (img.width > 1400 || img.height > 1080) {
            this.$notify({
              title: '失败',
              message: '上传图片分辨率建议1400*1080,宽度不可超过1400px，高度不超过1080px!',
              type: 'error',
              duration: 3000
            })
            return false
          }
        } else {
          img.onload = function() {
            if (img.width > 1400 || img.height > 1080) {
              this.$notify({
                title: '失败',
                message: '上传图片分辨率建议1400*1080,宽度不可超过1400px，高度不超过1080px!',
                type: 'error',
                duration: 3000
              })
              return false
            }
          }
        }
      }

      return extension || (extension2 && isLt2M)
    },

    // 上传文件
    handleRemove(file, fileList) {
      console.log('-----------移除上传数据----------')
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    beforeRemove(file, fileList) {
      console.log('-----------移除上传数据----------')
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess(response, file, fileList) {
      console.log('---------上传数据成功-------')
      console.log(response)
      console.log(fileList)
      if (response.count !== 0) {
        const fileArr = []
        fileList.forEach((item) => {
          if (item.response) {
            const fileObj = {
              name: item.response.relativePaths,
              url: item.response.absolutePaths
            }
            fileArr.push(fileObj)
            this.temp.cover = item.response.relativePaths
            this.temp.coverUrl = URL.createObjectURL(file.raw)
            console.log(`${item.response.relativePaths} 上传!`)
          } else {
            fileArr.push(item)
          }
        })
        this.$emit('update:fileList', fileArr)
        // console.log(`${item.response.relativePaths} 上传成功!`)
      } else {
        console.log(`${file.name} 上传失败，请重新再试`)
      }
    },
    // 上传图片
    handleAvatarSuccess(response, file, fileList) {
      this.temp.coverUrl = URL.createObjectURL(file.raw)
      this.temp.cover = file.name
      this.getList()
    },
    handleFilter() {
      // this.listQuery.page = 1
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
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        timestamp: new Date(),
        name: '',
        sort: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.fileList = []
      this.temp = {}
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          var adddata = {}
          adddata.Name = this.temp.name
          adddata.Cover = this.temp.cover
          adddata.Description = this.temp.description
          adddata.Price = Number(this.temp.price)
          adddata.Unit = this.temp.unit
          goodsadd(adddata).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          var editdata = {}
          editdata.Name = tempData.name
          editdata.Cover = tempData.cover
          editdata.Description = tempData.description
          editdata.Price = Number(tempData.price)
          editdata.Unit = tempData.unit
          goodsedit(editdata, tempData.id).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      console.log(row, index)
      deletegoostype(row.id).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style scoped>
.fontColor{
  color: grey;
}
</style>
