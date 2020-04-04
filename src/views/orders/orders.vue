<template>
  <div>
    <Crumb :name="name"></Crumb>
    <el-card>
      <el-row :gutter="15">
        <!-- 搜索框 -->
        <el-col :span="8">
          <!-- 将搜索框中的内容和 getUserParams.query 进行绑定，绑定后发起搜索服务请求  -->
          <el-input
            placeholder="请输入内容"
            v-model="goodsOrders.query"
            clearable
            @clear="clearGoodsOrder"
          >
            <!-- 搜索图标 -->
            <el-button @click="searchGoodsOrder" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表单 -->
      <el-table :data="goodsOrders" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="250px"></el-table-column>
        <el-table-column label="订单价格（元）" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template v-slot:default="scope">
            <el-tag type="success" v-if="scope.row.order_pay==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot:default="scope">{{scope.row.create_time*1000 | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot:default="scope">
            <el-tag type="primary" size="mini" class="el-icon-edit" @click="editGoodsOrder">编辑</el-tag>
            <el-tag type="warning" size="mini" class="el-icon-location" @click="locationIcon"></el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="SizeChange"
        @current-change="CurrentChange"
        :current-page="goodsOrdersParmas.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 编辑按钮 对话框 -->
    <el-dialog title="编辑地址" :visible.sync="editOrderVisible" width="60%">
      <!-- 对话框主体信息 -->
      <el-form :model="editOrderform" :rules="editOrderformRules" ref="editOrderform" label-width="120px">
        <el-form-item label="省市区/县" prop="address1">
           <el-cascader
            v-model="editOrderform.address1"
            :options="cityData"
            :props="cascaderProps"
            @change="selectCascader"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
            <el-input v-model="editOrderform.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 定位对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="locationOrderVisible" width="60%">
      <!-- 对话框主体信息 -->
      <el-timeline :reverse="false">
    <el-timeline-item v-for="(item,index) in orderLocation" :key='index'
     :timestamp="item.ftime" placement="top" :color="index===0?'#FFD03F':''">
      
        
        {{item.context}}
      
    </el-timeline-item>
    
  </el-timeline>
      

      
    </el-dialog>
  </div>
</template>

<script>
import Crumb from "@/components/common/crumb.vue";
import cityData from '@/assets/citydata.js';

export default {
  components: {
    Crumb
  },
  data() {
    return {
      name: {
        manage: "订单管理",
        user: "订单列表"
      },
      goodsOrdersParmas: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      goodsOrders: [],
      total: 0,
      editOrderVisible: false,
      editOrderform:{
          address1:[],
          address2:'',
      },
      editOrderformRules:{
          address1:[
              { required: true, message: "请选择地址", trigger: "blur" }
          ],
          address2:[
              { required: true, message: "请选择地址", trigger: "blur" }
          ]
      },
      cityData:cityData,
      cascaderProps:{
          expandTrigger: "hover"
      },
      locationOrderVisible:false,
        orderLocation:[],

    };
  },
  created() {
    this.getGoodsOrders();
  },
  methods: {
    /* 1. 获取全部后台订单数据 */
    getGoodsOrders() {
      this.$axios.get("orders", { params: this.goodsOrdersParmas }).then(e => {
        console.log(e.data);
        this.goodsOrders = e.data.data.goods;
        this.total = e.data.data.total;
      });
    },
    /* 2. 清楚搜索框内容 */
    clearGoodsOrder() {},
    /* 3. 搜索按钮 功能 */
    searchGoodsOrder() {},
    /* 4.1 分页-分页size选择 */
    SizeChange(size) {
      this.pagesize = size;
      this.getGoodsOrders();
    },
    /* 4.2 分页-分页page选择 */

    CurrentChange(pageChange) {
      this.pagenum = pageChange;
      this.getGoodsOrders();
    },
    /* 5. 编辑按钮功能 */
    editGoodsOrder(){
        this.editOrderVisible=true
    },
    /* 6. 地址级联选择器 选中后触发事件 */
    selectCascader(){},
    locationIcon(){
        this.$axios.get('kuaidi/804909574412544580').then(e=>{
            console.log(e.data)
            this.orderLocation=e.data.data
        })
        this.locationOrderVisible=true
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  margin: 20px 0;
}
.el-cascader{
    width: 100%;
}
.el-dialog__body li{
    text-align:left ;
    padding-left: 20px;
}
.classCor{
    color: #FFD03F
}
</style>