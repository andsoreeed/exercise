<template>
  <div>
    <div>
      <b-button variant="outline-primary" @click="openModal(true)" class="mt-4">建立新產品</b-button>
    </div>
    <!-- TODO: table用 -->
    <div class="d-flex justify-content-center">
      <b-spinner type="grow" class="m-5" variant="info" v-show="tableLoading"></b-spinner>
    </div>
    <table
      class="table mt-4"
      v-show="!tableLoading">
      <b-thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="150">其他</th>
        </tr>
      </b-thead>
      <b-tbody>
        <tr v-for="(item) in list" :key="item.id">
          <td>{{item.category}}</td>
          <td>{{item.title}}</td>
          <td class="text-right">{{item.origin_price | currency}}</td>
          <td class="text-right">{{item.price | currency }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-danger">未啟用</span>
          </td>
          <td>
            <b-button variant="outline-primary" size="sm" class="mr-2"
              @click="openModal(false, item)">
              編輯
            </b-button>
            <b-button variant="outline-danger" size="sm" @click="deleteModal(item)">刪除</b-button>
          </td>
        </tr>
      </b-tbody>
    </table>
    <b-pagination
      v-show="!tableLoading"
      align="center"
      v-model="pagination.current_page"
      :total-rows="rows"
      per-page="10"
      @change="changePage"
    ></b-pagination>
    <b-modal id="new-modal" :title="modalTitle"
      @ok="check" @hide="hide">
      <div>
        <b-form ref="form" @submit.stop.prevent="check">
          <b-form-group
            v-for="(item, index) in newConfig" :key="index"
            :label="item.label"
          >
            <!-- 上傳圖片 -->
              <!-- @change="uploaded" -->
            <div v-if="item.type === 'file'" >
              <b-form-file
                @input="uploaded"
                v-model="uploadData"
                placeholder="Choose a file or drop it here..."
                class="mt-3">
              </b-form-file>
              <div class="col-sm-4 mt-2">
                <b-spinner v-show="uploadLoading" small variant="primary"></b-spinner>
                <b-img
                  v-if="!uploadLoading && uploadImgUrl"
                  :src="uploadImgUrl"
                  fluid
                  alt="Responsive image"
                ></b-img>
              </div>
            </div>
            <b-form-input
              v-else-if="(item.type === 'text' && item.label !== '產品描述' && item.label !== '說明內容')
                || item.type === 'url'"
              v-model="item.value"
              :placeholder="item.placeholder"
              :type="item.type"
            ></b-form-input>
            <b-form-input
              v-else-if="item.type === 'number'"
              v-model.number="item.value"
              type="number"
              step="any"
            ></b-form-input>
            <b-form-textarea
              v-else-if="item.label === '產品描述' || item.label === '說明內容'"
              v-model="item.value"
              :placeholder="item.placeholder"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
            <b-form-checkbox
              v-else-if="item.type === 'checkbox'"
              v-model="item.value"
            >啟用
            </b-form-checkbox>
          </b-form-group>
        </b-form>
      </div>
    </b-modal>
    <b-modal id="delete-modal" title="刪除資料" @ok="deleteBtn" @hide="deleHide">
      <p class="my-4">確定刪除此筆資料？</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  data()  {
    return {
      list: [],
      formData: {
        imageUrl: '',
        image: null,
        title: '',
        category: '',
        unit: '個',
        origin_price: 0,
        price: 0,
        description: '',
        content: '',
        is_enabled: 1,
      },
      newConfig: [
        {
          label: '輸入網址',
          type: 'url',
          key: 'imageUrl',
          value: '',
          placeholder: '輸入圖片網址',
        },
        {
          label: '上傳圖片',
          type: 'file',
          key: 'image',
          value: null,
          placeholder: '選擇圖片',
        },
        {
          label: '標題',
          type: 'text',
          key: 'title',
          value: '',
          placeholder: '請輸入標題',
        },
        {
          label: '分類',
          type: 'text',
          key: 'category',
          value: '',
          placeholder: '請輸入分類',
        },
        {
          label: '單位',
          type: 'text',
          key: 'unit',
          value: '個',
          placeholder: '請輸入單位',
        },
        {
          label: '原價',
          type: 'number',
          key: 'origin_price',
          value: 0,
          placeholder: '請輸入原價',
        },
        {
          label: '售價',
          type: 'number',
          key: 'price',
          value: 0,
          placeholder: '請輸入售價',
        },
        {
          label: '產品描述',
          key: 'description',
          value: '',
          placeholder: '請輸入產品描述',
        },
        {
          label: '說明內容',
          key: 'content',
          value: '',
          placeholder: '請輸入產品說明內容',
        },
        {
          label: '是否啟用',
          type: 'checkbox',
          key: 'is_enabled',
          value: true,
        },
      ],
      isNew: false,
      deleData: null,
      modalTitle: '新增',
      uploadData: null,
      uploadImgUrl: null,
      uploadLoading: false,
      tableLoading: false,
      pagination: {},
      currentPage: 1,
    };
  },
  created() {
    this.getList();
  },
  computed: {
    rows() {
      console.log(this.pagination.total_pages * 10)
      return this.pagination.total_pages * 10;
    },
  },
  methods: {
    getList(page = 1) {
      this.tableLoading = true;
      const api =
        `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products?page=${page}`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.list = response.data.products;
          this.pagination = response.data.pagination;
          console.log('⛑️: getList -> this.list', this.pagination);
        }
        this.tableLoading = false;
      })
    },
    openModal(checkNew, item) {
      console.log('⛑️: openModal -> item', item);
      this.isNew = checkNew
      if(checkNew === false) {
        this.modalTitle = '修改';
        this.formData = item
        this.uploadImgUrl = item.imageUrl;
        this.newConfig.map((data) => {
          Object.keys(this.formData).map((key) => {
            if(key === data.key) {
              if(key === 'is_enabled') {
                item[key] = item[key] === 1 ? true : false;
              }
              data.value = item[key];
            }
          })
          if(data.key === 'imageUrl' && item.image) {
            console.log('進來囉')
            data.value = item.image;
            this.uploadImgUrl = item.image;
          }
        })
      } else {
        this.modalTitle = '新增';
      }
      this.$bvModal.show('new-modal');
    },
    check() {
      let api;
      let httpMethod;
      console.log('chek', this.formData);
      if(this.isNew) {
        api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product`;
        httpMethod = 'post';
        console.log('新增')
      } else {
        api =
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${this.formData.id}`;
        httpMethod = 'put';
      }
      const data = this.newConfig.reduce((preItem, item) => {
        if(item.key === 'is_enabled') {
          item.value = item.value ? 1 : 0;
        }
        return { ...preItem, [item.key]: item.value }
      }, {});
      
      console.log('⛑️: 新建產品 ->api ', data);
      this.$http[httpMethod](api, {data}).then((response) => {
        if (response.data.success) {
          this.list = response.data.products;
          console.log('⛑️: ', response);
          this.getList();
        } else {
          console.log('新建失敗')
        }
      })
      this.tableLoading = true;
    },
    deleteModal(item) {
      this.deleData = Object.assign({}, item);
      this.$bvModal.show('delete-modal');
    },
    deleteBtn() {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${this.deleData.id}`;
      this.$http.delete(api).then((response) => {
        if (response.data.success) {
          console.log("刪除");
          this.getList();
        } else {
          console.log("刪除失敗");
        }
      })
    },
    deleHide() {
      this.deleData = null;
    },
    hide() {
      this.resetform();
      console.log('Hide~~');
    },
    resetform() {
      this.newConfig = [
        {
          label: '輸入網址',
          type: 'url',
          key: 'imageUrl',
          value: '',
          placeholder: '輸入圖片網址',
        },
        {
          label: '上傳圖片',
          type: 'file',
          key: 'image',
          value: null,
          placeholder: '選擇圖片',
        },
        {
          label: '標題',
          type: 'text',
          key: 'title',
          value: '',
          placeholder: '請輸入標題',
        },
        {
          label: '分類',
          type: 'text',
          key: 'category',
          value: '',
          placeholder: '請輸入分類',
        },
        {
          label: '單位',
          type: 'text',
          key: 'unit',
          value: '個',
          placeholder: '請輸入單位',
        },
        {
          label: '原價',
          type: 'number',
          key: 'origin_price',
          value: 0,
          placeholder: '請輸入原價',
        },
        {
          label: '售價',
          type: 'number',
          key: 'price',
          value: 0,
          placeholder: '請輸入售價',
        },
        {
          label: '產品描述',
          key: 'description',
          value: '',
          placeholder: '請輸入產品描述',
        },
        {
          label: '說明內容',
          key: 'content',
          value: '',
          placeholder: '請輸入產品說明內容',
        },
        {
          label: '是否啟用',
          type: 'checkbox',
          key: 'is_enabled',
          value: true,
        },
      ];
      this.formData = {
        imageUrl: '',
        image: null,
        title: '',
        category: '',
        unit: '個',
        origin_price: 0,
        price: 0,
        description: '',
        content: '',
        is_enabled: 1,
      };
      this.uploadImgUrl = '';
    },
    uploaded() {
      this.uploadLoading = true;
      console.log('Data', this.uploadData)
      const formData = new FormData();
      formData.append('file-to-upload', this.uploadData);
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/upload`
      this.$http.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res =>  {
        if(res.data.success) {
          this.newConfig = this.newConfig.map((item) => {
            if(item.key === 'imageUrl' || item.key === 'image') {
              item.value = res.data.imageUrl;
            }
            this.uploadImgUrl = res.data.imageUrl;
            return item;
          })
          this.uploadLoading = false;
          console.log('⛑️: uploaded -> 上傳完畢 newConfig', this.newConfig);
        } else {
          this.$bus.$emit('alert-message', {
            messages: res.data.message,
            dismissSecs: 3,
            type: 'danger',
          });
        }
      })
    },
    changePage(page) {
      this.getList(page);
    }
  },
}
</script>