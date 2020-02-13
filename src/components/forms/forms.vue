<template>
  <div>
    <Form class="c_form" :model="formData" :rules="popRules" :ref="refs">
      <FormItem
        :prop="item.key"
        :label="item.title"
        v-if="item.key!=='handle' && ((!oper && !item.noEdit) || (oper && !item.noAdd))"
        :label-width="formLabel"
        v-for="(item, index) in columns"
        :key="index">
        <div v-if="item.searchFormItem === 'input'">
          <!--:disabled ="item.isDisabled || (!oper && item.editDisabled)"-->
          <!--新增编辑都不可修改，或者编辑时不可修改-->
          <Input v-model="formData[item.key]"
                 type="text"
                 :disabled ="item.isDisabled || (!oper && item.editDisabled)"
                 :number="item.isNumber"
                 :placeholder="`请输入${item.title}${item.placeHoder}`"
                 :style="{width: item.addClick ? '89%': '100%'}"
          >
          <span slot="append" v-if="item.unit">{{item.unit}}</span>
          </Input>
          <Button type="primary" icon="ios-search" v-if="item.addClick" @click="addSelctData(item.callback)"></Button>
          <!-- <span style="color:#dcdee2" v-if="item.unit">
              <span :class="[ formData[item.key]>0 ? 'black' : 'hid' ]" >输入时间估算为：{{Math.floor(formData[item.key]/1000/3600/24)}}天{{Math.floor(formData[item.key]/1000/3600%24)}}时{{Math.floor(formData[item.key]/1000/60%60)}}分{{Math.floor(formData[item.key]/1000%60%60)}}秒</span>
          </span> -->
        </div>
        <Input v-model="formData[item.key]" v-else-if="item.searchFormItem === 'password'" type="password" :placeholder="`请输入${item.title}`" ></Input>
        <div v-else-if="item.searchFormItem === 'select'">
          <Select v-model="formData[item.key]" :disabled ="item.isDisabled || (!oper && item.editDisabled)" :placeholder="`请输入${item.title}`" :transfer="true">
            <Option
              v-for="(subItem, subIndex) in $getDicList(item.dic)"
              :key="`${subIndex}_sub`"
              :value="subItem.dicCode">{{subItem.dicValue}}
            </Option>
          </Select>
        </div>
        <DatePicker :disabled ="item.isDisabled || (!oper && item.editDisabled)" v-model="formData[item.key]" v-else-if="item.searchFormItem === 'date'" type="date" :placeholder="`请输入${item.title}`"></DatePicker>
        <RadioGroup :disabled ="item.isDisabled || (!oper && item.editDisabled)" v-model="formData[item.key]" v-else-if="item.searchFormItem === 'radio'">
          <Radio label="male">Male</Radio>
          <Radio label="female">Female</Radio>
        </RadioGroup>
        <CheckboxGroup :disabled ="item.isDisabled || (!oper && item.editDisabled)" v-model="formData[item.key]" v-else-if="item.searchFormItem === 'checkbox'" >
          <Checkbox label="Eat"></Checkbox>
          <Checkbox label="Sleep"></Checkbox>
          <Checkbox label="Run"></Checkbox>
          <Checkbox label="Movie"></Checkbox>
        </CheckboxGroup>
        <Input :disabled ="item.isDisabled || (!oper && item.editDisabled)" v-model="formData[item.key]" v-else-if="item.searchFormItem === 'textarea'" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="`请输入${item.title}`"></Input>
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
      // 新增为true
      if (sessionStorage.getItem('submitFlag') === 'add') {
        this.oper = true;
      } else {
        // 编辑为false
        this.oper = false;
      }
    }
  },
  methods: {
    // 判断对象是否为空
    sEmptyObject (obj) {
      for (let key in obj) {
        return false;
      }
      return true;
    },
    getDicList (dic) {
      return JSON.parse(localStorage.getItem(dic));
    },
    // 选择框选择事件
    addSelctData (callback) {
      this.$emit('on-addSelctData', callback());
    },
    save () {
      this.$emit('on-save', this.formData);
    }
  },
  created () {
    this.popRules = {};
    for (let [, value] of this.columns.entries()) {
      if (value.rules) {
        this.popRules[value.key] = value.rules;
      }
    }
  }
};
</script>

<style lang="css" scoped>
.hid {
  display:none;
}
.black {
  /* color: red; */
}
</style>
