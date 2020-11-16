<template>
  <div>
    <b-spinner type="grow" class="m-5" variant="info" v-show="isLoading"></b-spinner>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <!-- <div style="height: 150px; background-size: cover; background-position: center"
            :style="{backgroundImage: `url(${item.imageUrl || item.image})`}">
          </div> -->
          <!-- img標籤 會對圖片固定比例 因此設定長寬會使圖片模糊-->
          <div style="
            width: 100%; height: 0;
            overflow: hidden;
            padding-bottom: 50%;
          ">
            <b-img-lazy
              :src="item.imageUrl || item.image"
              fluid
              alt="image">
            </b-img-lazy>
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
              <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <b-button variant="outline-secondary" size="sm" @click="openDetailModal(item.id)">
              查看更多
              <b-spinner v-show="item.id === modalLoading && !addCartStatus" type="grow" small></b-spinner>
            </b-button>
            <b-button variant="outline-danger" class="ml-auto" size="sm" @click="addCart(item.id)">
              加到購物車
              <b-spinner v-show="item.id === modalLoading && addCartStatus" type="grow" small></b-spinner>
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <b-modal id="detail-modal" :title="detailData.title" hide-footer>
      <div class="modal-body">
        <img :src="detailData.image" class="img-fluid" alt="">
        <blockquote class="blockquote mt-3">
          <p class="mb-0">{{ detailData.content }}</p>
          <footer class="blockquote-footer text-right">{{ detailData.description }}</footer>
        </blockquote>
        <div class="d-flex justify-content-between align-items-baseline">
          <div class="h4" v-if="!detailData.price">{{ detailData.origin_price }} 元</div>
          <del class="h6" v-if="detailData.price">原價 {{ detailData.origin_price }} 元</del>
          <div class="h4" v-if="detailData.price">現在只要 {{ detailData.price }} 元</div>
        </div>
        <!-- 滑桿 -->
        <b-form-spinbutton id="demo-sb" v-model="detailData.num" min="0" max="10"></b-form-spinbutton>
      </div>
      <div class="modal-footer">
        <div class="text-muted text-nowrap mr-3">
          小計 <strong>{{ detailData.num * detailData.price }}</strong> 元
        </div>
        <button type="button" class="btn btn-primary"
          @click="addCart(detailData.id, detailData.num)">
          <!-- <i class="fas fa-spinner fa-spin" v-if="detailData.id === status.loadingItem"></i> -->
          加到購物車
          <b-spinner v-show="detailData.id === modalLoading" type="grow" small></b-spinner>
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      isLoading: false,
      detailData: {},
      modalLoading: null,
      addCartStatus: false,
    };
  },
  computed: {
  },
  created() {
    this.getProducts();
  },
  methods: {
    getProducts() {
      const vm = this;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/products`;
      vm.isLoading = true;
      this.$http.get(url).then((res) => {
        vm.products = res.data.products;
        vm.isLoading = false;
      });
    },
    openDetailModal(id) {
      this.modalLoading = id;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
      this.$http.get(url).then((res) => {
        let productData = res.data.product;
        productData.num = 1; // 數量預設都是1
        this.detailData = productData;
        this.$bvModal.show('detail-modal')
        this.modalLoading = null;
      });
    },
    addCart(id, num = 1) {
      this.modalLoading = id;
      this.addCartStatus = true;
      const data = {
        product_id: id,
        qty: num,
      }
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      this.$http.post(url, { data }).then((res) => {
        this.$bus.$emit('alert-message', {
          messages: '加入購物車成功！',
          dismissSecs: 3,
          type: 'success',
        });
        this.getCart();
        this.$bvModal.hide('detail-modal')
        this.modalLoading = null;
        this.addCartStatus = false;
      });
    },
    // 取得購物車列表
    getCart() {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      this.$http.get(url).then((res) => {
        console.log('⛑️: 取得購物車列表', res);
      });
    }
  }
}
</script>