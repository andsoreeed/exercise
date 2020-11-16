<template>
  <div>
    <div v-show="pageLoading">
      <div class="d-flex bg-dark b-sidebar-backdrop align-items-center justify-content-center" style="z-index: 10">
        <b-spinner style="width: 3rem; height: 3rem;"
          variant="info"></b-spinner>
      </div>
    </div>
    <div>
      <b-form @submit="onSubmit">
        <b-card title="新增優惠卷">
          <b-container fluid>
            <b-form-row class="align-items-center mb-2">
              <b-col sm="auto">
                <label>優惠標題</label>
              </b-col>
              <b-col>
                <b-input
                  class="mb-2 mr-sm-2 mb-sm-0"
                  v-model="newCoupon.title"
                  required
                  :state="checkState(newCoupon.title)"
                  placeholder="優惠標題"
                ></b-input>
              </b-col>
              <b-col sm="auto">
                <label>優惠碼</label>
              </b-col>
              <b-col>
                <b-input
                  v-model="newCoupon.code"
                  :state="checkState(newCoupon.code)"
                  required
                  placeholder="優惠碼"></b-input>
              </b-col>
            </b-form-row>
            <b-form-row class="align-items-center mb-2">
              <b-col sm="auto">
                <label for="sb-readonly">折扣百分比</label>
              </b-col>
              <b-col>
                <b-input-group append="%">
                  <b-form-input
                    v-model="newCoupon.percent"
                    required
                    type="number" min="1" max="100"></b-form-input>
                </b-input-group>
              </b-col>
              <b-col sm="auto">
                <label for="example-datepicker">到期日期</label>
              </b-col>
              <b-col sm="auto">
                <b-form-datepicker
                  required
                  v-model="newCoupon.due_date">
                </b-form-datepicker>
              </b-col>
              <b-col>
                <b-form-checkbox
                  v-model.number="newCoupon.is_enabled"
                  value="1"
                  unchecked-value="0"
                >是否啟用
                </b-form-checkbox>
              </b-col>
            </b-form-row>
            <b-button class="float-sm-right" variant="primary" type="submit">Save</b-button>
          </b-container>
        </b-card>
      </b-form>
      <div class="mt-4">
        <b-table
          bordered
          striped
          hover
          :items="items"
          :fields="fields">
          <template v-slot:cell(show_details)="row">
            <b-button variant="link" size="sm" @click="showDetail(row)">
              {{ row.detailsShowing ? '隱藏' : '查看'}}．編輯
            </b-button>
          </template>
          <!-- 詳細資料 -->
          <template v-slot:row-details="row" v-show="row.detailsShowing">
            <b-card>
              <b-form>
                <b-row class="mb-2">
                  <b-col sm="2" class="text-sm-right"><b>優惠標題：</b>
                  </b-col>
                  <b-col sm="2">
                    <b-input
                      v-model="row.item.title"
                      required
                      :state="checkState(row.item.title)"/>
                  </b-col>
                  <b-col sm="2" class="text-sm-right"><b>優惠碼：</b></b-col>
                  <b-col sm="2">
                    <b-input
                      v-model="row.item.code"
                      required
                      :state="checkState(row.item.code)"/>
                  </b-col>
                </b-row>

                <b-row class="mb-2">
                  <b-col sm="2" class="text-sm-right"><b>折扣百分比：</b></b-col>
                  <b-col sm="auto">
                    <b-input-group append="%">
                      <b-form-input
                        v-model="row.item.percent"
                        required
                        type="number" min="1" max="100"></b-form-input>
                    </b-input-group>
                  </b-col>
                  <b-col sm="2" class="text-sm-right"><b>到期日期：</b></b-col>
                  <b-col sm="3">
                    <b-input-group class="mb-3">
                      <b-form-input
                        v-model="row.item.showDate"
                        type="text"
                        placeholder="YYYY-MM-DD"
                        autocomplete="off"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-form-datepicker
                          v-model="row.item.showDate"
                          button-only
                          right
                          aria-controls="example-input"
                          @context="onContext"
                          size="sm"
                          button-variant="info"
                          selected-variant="danger"
                        ></b-form-datepicker>
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                  <b-col>
                    <b-form-checkbox
                      v-model.number="row.item.is_enabled"
                      value="1"
                      unchecked-value="0"
                      switch>
                      啟用
                    </b-form-checkbox>
                  </b-col>
                </b-row>

                <b-row class="mb-2 mr-2 float-right">
                  <b-button variant="outline-primary" size="sm" class="mr-2" type="submit">
                    <b-icon icon="pencil-square" aria-hidden="true" @click="editItem(row.item)"/>
                  </b-button>
                  <b-button variant="outline-danger" size="sm">
                    <b-icon icon="trash" aria-hidden="true" @click="deleteItem(row.item)"/>
                  </b-button>
                </b-row>
              </b-form>
            </b-card>
          </template>
          <!-- 是否啟用 -->
          <template v-slot:cell(is_enabled)="row">
            <b-icon v-if="row.item.is_enabled === 1" icon="check-circle" variant="success"/>
            <b-icon v-else icon="x-circle" variant="danger"/>
          </template>
          <template v-slot:cell(showDate)="row">
            <span :class="[row.item.due_date < momentToday ? 'text-danger' : 'text-success']"
            >{{row.item.showDate}}</span>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      pageLoading: false,
      status: null,
      newCoupon: {
        title: null,
        code: null,
        percent: 100,
        due_date: this.$moment().format("YYYY-MM-DD"),
        is_enabled: 1,
      },
      editData: {},
      fields: [
        {
          key: 'title',
          label: '名稱',
        },
        {
          key: 'percent',
          label: '折扣百分比',
          sortable: true,
        },
        {
          key: 'showDate',
          label: '到期日期',
          sortable: true,
        },
        {
          key: 'is_enabled',
          label: '是否啟用',
        },
        {
          key: 'show_details',
          label: '詳細資料'
        }
      ],
      items: [],
      momentToday: Date.parse(moment().format("YYYY-MM-DD")) / 1000
    }
  },
  created() {
    this.getCouponList();
  },
  methods: {
    getCouponList() {
      const url =
        `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons`;
      this.$http.get(url).then((res) => {
        if (res.data.success) {
          console.log('⛑️: getCoupon！！！', res.data);
          let data = res.data.coupons;
          data.map((item) => {
            item._showDetails = false;
            item.showDate = moment.unix(item.due_date).format("YYYY-MM-DD");;
          })
          this.items = data;
        }
      });
    },
    onSubmit() {
      let data = {...this.newCoupon}
      data.due_date = Date.parse(this.newCoupon.due_date) / 1000;

      if (this.checkDate(data.due_date)) return;
      this.pageLoading = true;

      const url =
        `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`;
      this.$http.post(url, {data}).then((res) => {
        if (res.data.success) {
          this.$bus.$emit('alert-message', {
          messages: '新增優惠卷成功！',
          dismissSecs: 3,
          type: 'success',
          });
          this.getCouponList();
          this.resetData();
        }
        this.pageLoading = false;
      });
    },
    // 確認選擇日期是否小於今天
    checkDate(date) {
      console.log('⛑️: checkDate -> date', date);
      if (date < this.momentToday) {
        this.$bus.$emit('alert-message', {
          messages: '到期日期不能小於今日',
          dismissSecs: 3,
          type: 'danger',
        });
        return true;
      } else {
        return false;
      }
    },
    checkState(data) {
      if (data === null) {
        return null;
      } else if (data === '') {
        return false;
      } else {
        return true;
      }
    },
    resetData() {
      this.newCoupon = {
        title: null,
        code: null,
        percent: 100,
        due_date: this.$moment().format("YYYY-MM-DD"),
        is_enabled: 1,
      };
    },
    showDetail(row) {
      row.toggleDetails();
    },
    deleteItem(rowData) {
      this.pageLoading = true;
      let data = Object.assign({}, rowData);
      const url =
        `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${data.id}`;
      this.$http.delete(url).then((res) => {
        if (res.data.success) {
          this.$bus.$emit('alert-message', {
          messages: '已刪除優惠卷',
          dismissSecs: 3,
          type: 'warning',
          });
          this.getCouponList();
        }
        this.pageLoading = false;
      });
    },
    editItem(rowData) {
      let data = Object.assign({}, rowData);
      data.due_date = Date.parse(data.showDate) / 1000;
      if (this.checkDate(data.due_date)) return;
      this.pageLoading = true;
      const url =
        `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${data.id}`;
      this.$http.put(url, {data}).then((res) => {
        if (res.data.success) {
          this.$bus.$emit('alert-message', {
          messages: '修改優惠卷成功！',
          dismissSecs: 3,
          type: 'success',
          });
          this.getCouponList();
        }
        this.pageLoading = false;
      });
    },
    onContext(ctx) {
      // The date formatted in the locale, or the `label-no-date-selected` string
      // this.formatted = ctx.selectedFormatted
      // The following will be an empty string until a valid date is entered
      // this.selected = ctx.selectedYMD
    }
  }
}
</script>
