<template>
  <div>
    <Form class="c_form" :model="formData" :rules="popRules" :ref="refs">
      <FormItem
        :prop="item.key"
        :label="item.title"
        v-if="item.title!=='操作'"
        :label-width="formLabel"
        v-for="(item, index) in columns"
        :key="index">
        <div v-if="item.searchFormItem === 'input'">
          <Input v-model="formData[item.key]"
                 type="text"
                 :disabled ="detail"
                 :number="item.isNumber"
                 :placeholder="`请输入${item.title}`"
          >
          <span slot="append" v-if="item.unit">{{item.unit}}</span>
          </Input>
        </div>
        <Input v-model="formData[item.key]" v-else-if="item.searchFormItem === 'password'" type="password" :placeholder="`请输入${item.title}`" ></Input>
        <div v-else-if="item.searchFormItem === 'select'">
          <Select v-model="formData[item.key]" :disabled ="detail" :placeholder="`请输入${item.title}`" :transfer="true">
            <Option
              v-for="(subItem, subIndex) in $getDicList(item.dic)"
              :key="`${subIndex}_sub`"
              :value="subItem.dicCode">{{subItem.dicValue}}
            </Option>
          </Select>
        </div>
        <DatePicker :disabled ="detail" v-model="formData[item.key]" v-else-if="item.searchFormItem === 'date'" type="date" :placeholder="`请输入${item.title}`"></DatePicker>
        <RadioGroup :disabled ="detail" v-model="formData[item.key]" v-else-if="item.searchFormItem === 'radio'">
          <Radio label="male">Male</Radio>
          <Radio label="female">Female</Radio>
        </RadioGroup>
        <CheckboxGroup :disabled ="detail" v-model="formData[item.key]" v-else-if="item.searchFormItem === 'checkbox'" >
          <Checkbox label="Eat"></Checkbox>
          <Checkbox label="Sleep"></Checkbox>
          <Checkbox label="Run"></Checkbox>
          <Checkbox label="Movie"></Checkbox>
        </CheckboxGroup>
        <Input :disabled ="detail" v-model="formData[item.key]" v-else-if="item.searchFormItem === 'textarea'" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="`请输入${item.title}`"></Input>
        <Button type="primary"
                v-else-if="item.searchFormItem === 'button'"
                @click="save"
        >{{item.buttonTxt}}

        </Button>
        <span v-else></span>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: 'c_form',
  components: {},
  props: {
    formLabel: {
      type: Number,
      default: 100
    },
    detail: {
      type: Boolean,
      default: false
    },
    // 表单key，label列表
    columns: {
      type: Array,
      default: () => []
    },
    // 表单数据绑定,用于编辑时反显
    popData: {
      type: Object,
      default: () => ({})
    },
    refs: {
      type: String,
      default: ''
    },
    submitFlag: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {}, // 表单数据绑定
      // 表单规则校验
      popRules: {},
      subList: [],
      oper: null // false 为新增，true为编辑
    };
  },
  watch: {
    submitFlag () {
      let formData = this.formData;
      this.$refs[this.refs].validate((valid) => {
        this.$emit('on-success', {formData, valid});
      });
    },
    popData (val) {
      this.formData = val;
    }
  },
  methods: {
    getDicList (dic) {
      return JSON.parse(localStorage.getItem(dic));
    },
    save () {
      this.$emit('on-save', this.formData);
    }
  }
};
</script>

<style lang="css" scoped>

</style>
