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
            v-model="goodsListParams.query"
            clearable
            @clear="clearGoodsSearch"
          >
            <!-- 搜索图标 -->
            <el-button @click="searchGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>

        <!-- 添加商品按钮 -->
        <el-col :span="2">
          <el-button type="primary" class="serchBtn" @click="addGoodsPage" >添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="500px"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="90px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template v-slot:default="scope">{{scope.row.add_time*1000 | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="SizeChange"
        @current-change="CurrentChange"
        :current-page="goodsListParams.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 添加商品按钮 对话框 -->
    <el-dialog title="添加商品" :visible.sync="addGoodsVisible" width="60%">
      <span>添加商品</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addGoodsVisible= false">取 消</el-button>
        <el-button type="primary" @click="addGoodsVisible=false">确 定</el-button>
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
        user: "商品列表"
      },
      goodsList: [],
      total: 0,
      goodsListParams: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      addGoodsVisible: false
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    /* 1. 获取商品列表数据 get goods  
      参数:query  pagenum  pagesize */
    getGoodsList() {
      this.$axios
        .get("goods", {
          params: this.goodsListParams
        })
        .then(e => {
          console.log(e.data);
          this.goodsList = e.data.data.goods;
          this.total = e.data.data.total;
        });
    },
    /* 2. 清除搜索框内内容 */
    clearGoodsSearch() {
      this.goodsListParams.pagenum = 1;
      this.getGoodsList();
    },
    /* 3. 搜索框的 搜索按钮并发送请求 */
    searchGoodsList() {
      this.goodsListParams.pagenum = 1;
      this.getGoodsList();
    },
    /* 4.分页- 每页展示项  */
    SizeChange(size) {
      this.goodsListParams.pagesize = size;
      this.getGoodsList();
    },
    /* 5. 分页- 显示当前页面的数据 */
    CurrentChange(page) {
      this.goodsListParams.pagenum = page;
      this.getGoodsList();
    },
    /* 6. 删除按钮功能，发送删除请求 */
    deleteGoods(attrId) {
      console.log(attrId);
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`goods/${attrId}`).then(e => {
            console.log(e.data);
            if (e.data.meta.status !== 200)
              return this.$message.error(e.data.meta.msg);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getGoodsList()
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /* 7. 添加商品跳转到 goods/add 添加商品页面 */
    addGoodsPage(){
        this.$router.push('/goods/add')
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  margin: 20px 0;
}
</style>