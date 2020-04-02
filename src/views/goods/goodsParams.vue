<template>
  <div>
    <Crumb :name="name"></Crumb>
    <el-card>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
        </el-col>
      </el-row>

      <el-row :gutter="15">
        <el-col :span="3">
          <p>选择商品分类：</p>
        </el-col>
        <el-col :span="5">
          <el-cascader
            v-model="cascaderIdArr"
            :options="cateList"
            :props="cascaderProps"
            @change="selectPraCascader"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="tabsParams">
        <el-tab-pane label="用户管理" name="many">
          <el-row :gutter="15">
            <el-col :span="2">
              <el-button type="primary" class="paramsBtn" @click="addParams" :disabled="disabledBtn">动态参数</el-button>
            </el-col>
          </el-row>

          <el-table border stripe :data="paramsMany">
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <el-tag closable @close="closeTag(scope.row,index)" v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editParams(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only">
          <el-row :gutter="15">
            <el-col :span="2">
              <el-button type="primary" class="paramsBtn" @click="addParams" :disabled="disabledBtn">静态参数</el-button>
            </el-col>
          </el-row>

          <el-table border stripe :data="paramsOnly">
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <el-tag closable @close="closeTag(scope.row,index)" v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editParams(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 编辑 动态/静态属性对话框 -->
    <el-dialog
      :title="'编辑'+titleTxt"
      :visible.sync="editParamsVisible"
      width="60%"
      @close="resetEditParams"
    >
      <!-- 对话框主体信息 -->
      <el-form
        :model="editParamsModel"
        ref="editParamsform"
        :rules="editParamsformRules"
        label-width="100px"
      >
        <el-form-item :label="titleTxt" prop="attr_name">
          <el-input v-model="editParamsModel.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加动态参数/静态参数 共用一个 对话框，所以要使用到计算属性，computed -->
    <el-dialog
      :title="'添加'+titleTxt"
      :visible.sync="addParamsVisible"
      width="60%"
      @close="resetAddParams"
    >
      <el-form
        :model="addParamsModel"
        ref="addParamsformRef"
        :rules="addParamsformRules"
        label-width="100px"
      >
        <el-form-item :label="titleTxt" prop="attr_name">
          <el-input v-model="addParamsModel.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Crumb from "@/components/common/crumb.vue";

export default {
  components: {
    Crumb
  },
  data() {
    return {
      name: {
        manage: "商品管理",
        user: "分类参数"
      },
      cateList: [],
      cascaderIdArr: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      disabledBtn:false,
      activeName: "many",
      cateId: "",
      paramsList: [],
      paramsMany: [],
      editParamsModel: {
        attr_name: ""
      },
      paramsOnly: [],

      editParamsVisible: false,
      editParamsformRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      attrId: "",
      addParamsVisible: false,
      addParamsModel: {
        attr_name: ""
      },
      addParamsformRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    titleTxt() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  },
  methods: {
    /* 1. 获取树形 级联下的所有商品类型 */
    getCateList() {
      this.$axios.get("categories").then(e => {
        this.cateList = e.data.data;
      });
    },
    /* 2. 树形级联 触发函数，拿到被选定的类型 的id ，并根据参数加载默认参数类型下的数据*/
    selectPraCascader() {
      //console.log(this.cascaderIdArr)
      this.cateId = this.cascaderIdArr[2]; //拿到树形选项中被选中项的 3级id
      // console.log(this.cateId)
      this.getTabsParams();

    },
    /* 3. tabs切换时函数 */
    tabsParams() {
      //console.log(this.activeName)
      this.getTabsParams(); // 当参数类型被切换时会触发这个函数
      //console.log(this.activeName);
    },
    /* 4. 获取不同类型下的 商品参数 */
    getTabsParams() {
      /* 在这个函数中，获取到不同状态下 的 具体的参数 数据
        get:  categories/:cateId/attributes  参数： [only,many]]] */
        // 如果选中的不是3级的分类，那么就不给选中， 让数组为空
        if(this.cascaderIdArr.length!==3){
          this.disabledBtn=true
          this.cascaderIdArr=[]
        this.paramsMany=[]
        this.paramsOnly=[]
          return

        }
      this.disabledBtn=false
      this.$axios
        .get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName }
        })
        .then(e => {
          // console.log(e.data)
          //在赋值之前给所有的.data中的item项 遍历一下，将里面 attr_vals中的值变成数组的形式
          //2.给el-input 中的绑定的值绑定到 item下，这样可以让每一个item拥有各自的 inputVisible和inputValue
          e.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
            item.inputVisible = false;
            item.inputValue = "";
          });
         // console.log(e.data);
          if (this.activeName === "many") {
            this.paramsMany = e.data.data;
            // console.log(this.paramsMany);
          } else {
            this.paramsOnly = e.data.data;
          }
          // console.log(this.paramsMany);
        });
    },
    /* 5. 编辑按钮的功能 */
    editParams(scope) {
      //console.log(scope.attr_name)
      console.log(scope);
      this.attrId = scope.attr_id;
      this.editParamsModel.attr_name = scope.attr_name;
      this.editParamsVisible = true;
    },
    /* 5.1 编辑对话框中的重置功能 */
    resetEditParams() {
      this.$refs.editParamsform.resetFields();
    },
    /* 6. 编辑按钮的确定功能 发送编辑请求 categories/:id/attributes/:attrid 
    参数: attr_name attr_sel attr_vals */
    editParamsConfirm() {
      /*  this.$axios.post('categories',{params:{attr_name:this.editParamsModel.attr_name}}).then(e=>{
        console.log(e.data)
      }) */

      this.$refs.editParamsform.validate(valia => {
        if (!valia) return;
        this.$axios
          .put(`categories/${this.cateId}/attributes/${this.attrId}`, {
            attr_name: this.editParamsModel.attr_name,
            attr_sel: this.activeName
          })
          .then(e => {
            if (e.data.meta.status !== 200) {
              return this.$message.error(e.data.meta.msg);
            } else {
              this.$message.success("编辑参数成功");
            }
          });
      });
      this.editParamsVisible = false;
    },
    /* 7. 添加动态/静态参数 按钮 */
    addParams() {
      this.addParamsVisible = true;
    },
    /* 8.添加参数对话框 重新信息 */
    resetAddParams() {
      this.$refs.addParamsformRef.resetFields();
    },
    /* 8. 添加参数后的确认按钮 发送请求 categories/:id/attributes  id为当前用户的 id
    参数：attr_name,attr_sel:[only/many]*/
    addParamsConfirm() {
      //预验证
      this.$refs.addParamsformRef.validate(valia => {
        if (!valia) return;
        this.$axios
          .post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addParamsModel.attr_name,
            attr_sel: this.activeName
          })
          .then(e => {
            // console.log(e.data)
            if (e.data.meta.status !== 201) {
              return this.$message.error(e.data.meta.msg);
            } else {
              this.$message.success("添加参数成功");
              this.getTabsParams();
              this.addParamsVisible = false;
            }
          });
      });
    },
    /* 9.删除按钮 */
    removeParams(attrId) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(`categories/${this.cateId}/attributes/${attrId}`)
            .then(e => {
              //console.log(e.data)
              if (e.data.meta.status !== 200)
                return this.$message.error(e.data.meta.msg);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /* 10. input-new-tag 中当键盘、鼠标失去焦点时候 显示回btn,并清空Input中的值 */
    handleInputConfirm(scope) {
      //做一个判断，当输入为空时，清除Input值，
      if (scope.inputValue.trim().length === 0) {
        scope.inputValue = "";
        scope.inputVisible = false;

        return;
      }
      scope.attr_vals.push(scope.inputValue.trim())
      scope.inputValue = "";
      scope.inputVisible = false;
     this.putNewAttrVals(scope);
      

    },
     //10.1  向后台发起请求，将添加的数据保存到后台 put categories/:id/attributes/:attrid
      // 参数：attr_name(属性名称) attr_vals attr_sel:[many,only]
    putNewAttrVals(scope){
      this.$axios.put(`categories/${this.cateId}/attributes/${scope.attr_id}`,{
        attr_name:scope.attr_name,
        attr_vals:scope.attr_vals.join(','),
        attr_sel:scope.attr_sel,
      }).then(e=>{
        //console.log(e.data)
        if (e.data.meta.status !== 200) {
              return this.$message.error(e.data.meta.msg);
            } else {
              this.$message.success("更新参数Tag成功");
            }

      })
    },
    /* 11. tag 下的new tag 按钮函数，需要点击时候自动获取焦点，
     使用this.$nextTick() 表示：在下一次重新渲染元素的时候才执行这个方法中的函数，避免元素尚未重新渲染就执行，
     可能拿不到该 input的情况发生*/

    showInput(scope) {
      scope.inputVisible = true;
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    /* 12. 删除 参数tag 功能 */
    closeTag(scope,index){
      // 从 attr_vals 数组中删除 当前index 的tag ,在将删除后的数组传给 后端
      scope.attr_vals.splice(index,1)
      this.putNewAttrVals(scope)

      
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-tag {
  margin-right: 10px;
}
.input-new-tag {
  width: 120px;
  line-height: 30px;
}
.button-new-tag {
  height: 32px;
}
</style>