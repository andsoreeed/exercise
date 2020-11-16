<template>
  <div>
    <b-modal
      id="userModal"
      ref="modal"
      title="填寫購買人資訊"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
          <validation-provider
            name="Name"
            :rules="{ required: true, min: 3 }"
            v-slot="validationContext"
          >
            <b-form-group id="example-input-group-1" label="Name" label-for="example-input-1">
              <b-form-input
                id="example-input-1"
                name="example-input-1"
                v-model="form.name"
                :state="getValidationState(validationContext)"
                aria-describedby="input-1-live-feedback"
              ></b-form-input>

              <b-form-invalid-feedback id="input-1-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <validation-provider name="Food" :rules="{ required: true }" v-slot="validationContext">
            <b-form-group id="example-input-group-2" label="Food" label-for="example-input-2">
              <b-form-select
                id="example-input-2"
                name="example-input-2"
                v-model="form.food"
                :options="foods"
                :state="getValidationState(validationContext)"
                aria-describedby="input-2-live-feedback"
              ></b-form-select>

              <b-form-invalid-feedback id="input-2-live-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- <b-button type="submit" variant="primary">Submit</b-button>
          <b-button class="ml-2" @click="resetForm()">Reset</b-button> -->
        </b-form>
      </validation-observer>
      <!-- <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          v-for="(item, index) in items" :key="index"
          :state="validateState('')"
          :label="item.label"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-input
            id="name-input"
            v-model="item.value"
            :state="item.state"
            required
          ></b-form-input>
        </b-form-group>
      </!--> -->
    </b-modal>
  </div>
</template>

<script>
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize
} from "vee-validate";
import { required, email, min } from 'vee-validate/dist/rules';

extend('min', value => {
  console.log('⛑️: value', value);
  return value.length > 3;
});

extend('required', {
  ...required,
  message: '填啊你！'
});
export default {
  // props: ['handleOk'],
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      items: [
        {
          key: 'name',
          label: '姓名',
          value: '',
          state: null,
        },
        {
          key: 'email',
          label: '信箱',
          value: '',
          state: null,
        },
        {
          key: 'tel',
          label: '手機',
          value: '',
          state: null,
        },
        {
          key: 'address',
          label: '居住地',
          value: '',
          state: null,
        },
        {
          key: 'message',
          label: '備註',
          value: '',
          state: null,
        },
      ],
      submittedNames: [],
      foods: [
        { value: null, text: "Choose..." },
        { value: "apple", text: "Apple" },
        { value: "orange", text: "Orange" }
      ],
      form: {
        name: null,
        food: null
      },
    }
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    resetForm() {
      this.form = {
        name: null,
        food: null
      };

      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    },

    resetModal() {
      this.items = [
        {
          label: '姓名',
          value: '',
          state: null,
        },
        {
          label: '信箱',
          value: '',
          state: null,
        },
        {
          label: '手機',
          value: '',
          state: null,
        },
        {
          label: '居住地',
          value: '',
          state: null,
        },
        {
          label: '備註',
          value: '',
          state: null,
        },
      ];
    },
    checkFormValidity() {
      console.log('⛑️: checkFormValidity');
      // this.nameState = valid
      // return valid
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
    },
  },
}
</script>
