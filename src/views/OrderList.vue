<template>
  <div>
    <div class="d-flex justify-content-center">
      <b-spinner type="grow" class="m-5" variant="info" v-show="tableLoading"></b-spinner>
    </div>
    <b-table
      ref="selectableTable"
      selectable
      :items="items"
      :fields="fields"
      @row-selected="onRowSelected"
      responsive="sm"
      caption-top
    >
      <template v-slot:table-caption>訂單列表</template>
      <!-- Example scoped slot for select state illustrative purposes -->
      <template v-slot:cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span aria-hidden="true">&check;</span>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fields: ['selected', 'isActive', 'age', 'first_name','num', 'total'],
      items: [
        { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' }
      ],
      selected: []
    }
  },
  methods: {
    onRowSelected(items) {
      this.selected = items
    },
  }
}
</script>
