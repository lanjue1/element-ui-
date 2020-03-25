<template>
  <div>
    <Crumb :name="name"></Crumb>
    <el-card>
      <el-row :gutter="15">
        <el-col :span="2">
          <el-button type="primary" @click="addCate">添加商品类型</el-button>
        </el-col>
      </el-row>

      <!-- element中没有 合适的树形插件， 加载npm i vue-table-with-tree-grid -s  -->
      <ZkTable
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="序号"
        border
      >
        <!-- 是否有效 -->
        <template v-slot:isUsed="scope">
          <i class="el-icon-success" style="color:#90E119" v-if="scope.row.cat_deleted===false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 -->
        <template v-slot:class="scope">
          <el-button type="primary" plain size="mini" v-if="scope.row.cat_level===0">一级</el-button>
          <el-button type="success" plain size="mini" v-else-if="scope.row.cat_level===1">二级</el-button>
          <el-button type="warning" plain size="mini" v-else>三级</el-button>
        </template>
        <!-- 操作 -->
        <template v-slot:handle="scope">
          <el-button-group>
            <el-button type="primary" plain icon="el-icon-edit" size="mini">编辑</el-button>

            <el-button type="danger" plain icon="el-icon-delete" size="mini">删除</el-button>
          </el-button-group>
        </template>
      </ZkTable>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateParams.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="cateParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加商品类型 对话框 -->
    <el-dialog title="添加商品类型" :visible.sync="addCateVisible" width="60%">
      <!-- 对话框主体信息 -->
      <el-form :model="addCateform" :rules="addCateformRules" ref="addCateform" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="cascaderIdArr"
            :options="cascaderList"
            :props="cascaderProps"
            @change="selectCascader"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateformConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Crumb from "@/components/common/crumb.vue";

export default {
  name: "goodsCate",
  components: {
    Crumb
  },
  data() {
    return {
      name: {
        manage: "商品管理",
        user: "商品列表"
      },
      cateList: [],
      cateParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 30,
      addCateVisible: false,
      addCateform: {
        cat_name: "",
        cat_level: "",
        cat_pid: ""
      },
      cateTest: false,
      cascaderIdArr: [],

      cascaderList: [],

      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      addCateformRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      columns: [
        { label: "分类名称", prop: "cat_name" },

        {
          label: "是否有效",
          type: "template",
          template: "isUsed"
        },
        {
          label: "排序",
          type: "template",
          template: "class"
        },
        {
          label: "操作",
          type: "template",
          template: "handle"
        }
      ]
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    /* 1. 获取 cate 页面商品类型数据 */
    getCateList() {
      this.$axios.get("categories", { params: this.cateParams }).then(e => {
        this.cateList = e.data.data.result;
        console.log(e.data.data.result);
        /* 返回的总类型 条数 */
        this.total = e.data.data.total;
      });
    },
    /* 2， 分页的每页显示条数的 方法 */
    handleSizeChange(newsize) {
      this.cateParams.pagesize = newsize;
      console.log(this.cateParams.pagesize);
      this.getCateList();
    },
    /* 3. 分页的当前页的 加载数据 */
    handleCurrentChange(newpage) {
      this.cateParams.pagenum = newpage;
      this.getCateList();
    },
    /* 4. 添加商品 按钮 函数 */
    addCate() {
      this.$axios.get("categories", { params: { type: 2 } }).then(e => {
        this.cascaderList = e.data.data;
        console.log(e);
      });
      this.addCateVisible = true;
    },
    /* 5. 添加商品 对话框 确认之后 数据请求 */
    addCateformConfirm() {
      console.log(this.cascaderIdArr);
      if (this.cascaderIdArr.length === 0) {
        this.$message.error("请选择父级分类");
        return;
      } else {
        //先预验证
        this.$refs.addCateform.validate(valid => {
          if (!valid) return;
         
          this.$axios.post("categories", this.addCateform).then(e => {
            console.log(e.data);
            this.getCateList();
            this.addCateform.cat_pid = 0;
          this.addCateform.cat_level = 0;
          this.cascaderIdArr = [];
          this.$refs.addCateform.resetFields();
          this.addCateVisible = false;
          });

          

          
        });
      }
    },
    /* 6. 添加商品对话框 选择项发生变化 触发这个函数 */
    selectCascader() {
      /* 给 addCateform {}中添加 cat_level:'', cat_pid:'',*/
      //等级=this.cascaderIdArr这个数组的长度，新建的是3级，那么level=2 = 1 个1级父类+1个2级父类
      // 同时，父id 是数组中的最后一个 id
     
      if (this.cascaderIdArr.length > 0) {
        this.addCateform.cat_pid = this.cascaderIdArr[
          this.cascaderIdArr.length - 1
        ];
        this.addCateform.cat_level = this.cascaderIdArr.length;
        console.log(this.addCateform)
        return;
      } else {
        this.addCateform.cat_pid = 0;
        this.addCateform.cat_level = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
</style>