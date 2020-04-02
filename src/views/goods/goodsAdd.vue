<template>
  <div>
    <Crumb :name="name"></Crumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeStep-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- form 表单要放在方面包裹起来，因为 el-tab-pane只能做 el-tabs的子元素 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="150px"
      >
        <!--el-tabs下的 :before-leave 属性是个函数，切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。-->
        <el-tabs
          tab-position="left"
          v-model="activeStep"
          :before-leave="beforeLeaveTabs"
          @tab-click="tabAllClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="cascaderChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格（元）" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量（g）" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1" >
            <el-form-item
              :label="item1.attr_name"
              v-for="(item1,index1) in paramsMany"
              :key="index1"
            >
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox
                  :label="item"
                  v-for="(item,index) in item1.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item1.attr_name"
              v-for="(item1,index1) in paramsOnly"
              :key="index1" 
            >
              <el-input v-model="item1.attr_vals"></el-input >
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 注意： 在 el-upload组件中是没有用到axios的，它自己有一套ajax请求，所以要定义一个一样的请求头 -->
            <el-upload
              
              action="https://www.liulongbin.top:8888/api/private/v1/upload"
              :on-preview="uploadPreview"
              :on-remove="picRemove"
              :headers='headers'
              :on-success="picSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce">

            </quill-editor>
            <el-button type="primary" @click="addGoodsBtn" class="addGoodsBtn">
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览框 -->
    <el-dialog
      
      :visible.sync="imgPreviewVisible"
      width="60%"
      
    >
      <img :src="imgUrl" alt="" class="imgPreview">

      
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
        user: "添加商品"
      },
      cateList: [],
      paramsMany: [],
      paramsOnly: [],

      activeStep: "0",
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },

      addGoodsForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pic:[],
        goods_introduce:'',
        attrs:[],
      },
      imgUrl:'',
      imgPreviewVisible:false,
      cateId: 0,
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      headers:{
        Authorization:window.sessionStorage.getItem('token')
      }
    };
  },
  created() {
    this.getCateList();
  },

  methods: {
    /* 1. 获取 级联 下的所有商品分类 */
    getCateList() {
      this.$axios.get("categories").then(e => {
        this.cateList = e.data.data;
        //console.log(this.cateList);
      });
    },
    /* 2. 级联下的选中后的触发事件 */
    cascaderChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = [];
        this.$message.warning("请选择第三级分类");
        return;
      }
      this.cateId = this.addGoodsForm.goods_cat[2];
    },
    /* 3. 切换 tabs 之前先做判断，如果不符合条件则不允许切换 tabs */
    beforeLeaveTabs(newTab, oldTab) {
      // console.log(newTab);
      //console.log(oldTab);
      // 如果在基本信息页面且没有选择级联 分类，则不允许切换tabs
      if (oldTab === "0" && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.warning("请选择商品分类");
        return false;
      }
    },
    /* 4. tabs 切换时候触发的函数 */
    tabAllClick() {
     // console.log(this.activeStep);
      if (this.activeStep === "1") {
        this.$axios
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "many" }
          })
          .then(e => {
            e.data.data.forEach(item => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
            });
            // console.log(e.data.data);
            this.paramsMany = e.data.data;
          });
      } else if (this.activeStep === "2") {
        this.$axios
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "only" }
          })
          .then(e => {
            e.data.data.forEach(item => { 
              console.log(item)
              item.attr_vals = item.attr_vals.length===0?'': item.attr_vals;

             // item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : '';
            });
            
            this.paramsOnly = e.data.data;
            console.log(this.paramsOnly);
          });
      } else if (this.activeStep === "3") {
      }
    },
    /* 5.1 图片上传- 上传预览事件 */
    uploadPreview(file,fileList){
     // console.log(file)
      
      this.imgUrl=file.response.data.url
      this.imgPreviewVisible=true

    },
    /* 5.2 图片上传-图片移除事件*/
    picRemove(file,fileList){
      //console.log(file)
      //console.log(fileList)
      //1. 通过file.response.data.tmp_path 找到需要移除的当前图片的临时地址
      //2. 通过临时地址，找到对应的pic 数组中的对应的 index 
      //3. 删除pic数组中对应index 的项
      const tmpPath=file.response.data.tmp_path
      const i=this.addGoodsForm.pic.findIndex(i=>{
        i.pic=tmpPath
      })
      this.addGoodsForm.pic.splice(i,1)
     // console.log(this.addGoodsForm)
    },
    /* 5.3 图片上传- 图片上传成功后，向 addGoodsForm 中添加上传的图片存放地址*/
    picSuccess(picData){
      //console.log(picData)
      const picPath={pic:picData.data.tmp_path}  // picData.data.tmp_path图片的临时存放路径
      this.addGoodsForm.pic.push(picPath)
      //console.log(this.addGoodsForm)
    },
    /* 5.4 完成页面-添加商品按钮 */
    addGoodsBtn(){
      //先预验证
      this.$refs.addGoodsFormRef.validate(valia=>{
        if(!valia){
          return this.$message.error('请填写必要的表单项')
        }
        // 1 .验证通过，执行发送请求的逻辑，但 goods_cat 后台要求传字符串形势"1,2,3",而
        // v-model="addGoodsForm.goods_cat"需要的是数组，所以，需要深拷贝一份,再将数组转为字符串
        /* 方法二：使用深拷贝， lodash 插件中有一个 cloneDeep 方法， npm i lodash -s ,
        用的时候import _ from 'lodash'  :  _.cloneDeep()*/
        var form=JSON.parse(JSON.stringify(this.addGoodsForm))
        form.goods_cat=form.goods_cat.join(',')
        

        /* 2. 把选择的 商品属性保存到attrs 中，分动态属性和静态属性 */
        this.paramsMany.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(',') // 因为动态属性 中的 attr_vals是数组，要转换成字符串
            }
            this.addGoodsForm.attrs.push(newInfo)

        })
        this.paramsOnly.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals 
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        //console.log(this.paramsOnly)
        form.attrs=this.addGoodsForm.attrs
        console.log(form)

        // 向后台发送请求
        this.$axios.post('goods',form).then(e=>{
          console.log(e.data)
        })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.el-steps {
  margin: 20px 0 40px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-cascader {
  width: 100%;
}
/* .el-form-item__label {
  position: absolute;
  left: 30px;
} */
.el-checkbox {
  margin: 0 10px 10px 0 !important;
}
.el-checkbox-group {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-content: center;
}
.imgPreview{
  width: 100%;
}
.addGoodsBtn{
  margin-top: 20px;
}
</style>