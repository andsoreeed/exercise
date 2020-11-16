<template>
  <div>
    <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div class="sidebar-sticky pt-3">
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>管理功能</span>
          <a class="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard/product">
              <b-icon icon="box-seam" class="mr-1"></b-icon>
              <span class="align-self-center">產品列表</span>
            </router-link>
          </li>
        </ul>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard/coupon">
              <b-icon icon="gift" class="mr-1"></b-icon>
              <span class="align-self-center">優惠卷</span>
            </router-link>
          </li>
        </ul>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard/orderList">
              <b-icon icon="card-checklist" class="mr-1"></b-icon>
              <span class="align-self-center">訂單列表</span>
            </router-link>
          </li>
        </ul>
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>模擬功能</span>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard/customer_order">
              <b-icon icon="bag-check" class="mr-1"></b-icon>
              <span class="align-self-center">訂單功能</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- <b-sidebar id="sidebar-right" title="購物車" shadow @hidden="cartHide">
      <div class="px-3 py-2">
        <b-table
          striped
          hover
          borderless
          :busy="tableLoading"
          :fields="fields"
          :items="cartData">
          <template v-slot:table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
      </template></b-table>
      </div>
      <template v-slot:footer="{ hide }">
      <div class="d-flex align-items-center px-3 py-2">
        <strong class="mr-auto">全部金額
          <span class="text-danger">{{checkout.total | currency}}</span>
        </strong>
        <b-button variant="danger" size="sm" @click="checkoutMethod(hide)">結帳</b-button>
      </div>
      </template>
    </b-sidebar> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableLoading: true,
      fields: [
        {
          key: 'title',
          label: '品名'
        },
        {
          key: 'qty',
          label: '數量'
        },
        {
          key: 'final_total',
          label: '單價',
          sortable: true,
          variant: 'danger'
        }
      ],
      cartData: [],
      checkout: {},
      loginStatus: false,
    }
  },
  created() {
  },
  methods: {
    // checkoutMethod (colse) {
    //   console.log('先結帳');
    //   colse();
    // },
    // cartHide() {
    //   console.log("隱藏");
    //   this.tableLoading = true;
    // }
  }
}
</script>