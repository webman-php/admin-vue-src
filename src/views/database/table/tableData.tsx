import { FormSchema } from '/@/components/Table';

export const typeToControlMap = [
  { integer: 'InputNumber' },
  { string: 'Input' },
  { text: 'InputTextArea' },
  { date: 'DatePicker' },
  { enum: 'Select' },
  { float: 'Input' },
  { tinyInteger: 'InputNumber' },
  { smallInteger: 'InputNumber' },
  { mediumInteger: 'InputNumber' },
  { bigInteger: 'InputNumber' },
  { unsignedInteger: 'InputNumber' },
  { unsignedTinyInteger: 'InputNumber' },
  { unsignedSmallInteger: 'InputNumber' },
  { unsignedMediumInteger: 'InputNumber' },
  { unsignedBigInteger: 'InputNumber' },
  { decimal: 'Input' },
  { double: 'Input' },
  { mediumText: 'InputTextArea' },
  { longText: 'InputTextArea' },
  { dateTime: 'DatePicker' },
  { time: 'DatePicker' },
  { timestamp: 'DatePicker' },
  { char: 'Input' },
  { binary: 'Input' },
];

const options: any[] = [];

for (const item of typeToControlMap) {
  for (const type in item) {
    options.push({
      label: type,
      value: type,
      key: type,
    });
    typeToControlMap[type] = item[type];
  }
}

export function typeToControl(type: string) {
  return typeToControlMap[type] || 'Input';
}

export const controlSelectOptions = [
  {
    label: '文本框',
    value: 'Input',
  },
  {
    label: '多行文本',
    value: 'InputTextArea',
  },
  {
    label: '下拉选择',
    value: 'Select',
  },
  {
    label: '数字文本框',
    value: 'InputNumber',
  },
  {
    label: '日期选择',
    value: 'DatePicker',
  },
  {
    label: '时间选择',
    value: 'TimePicker',
  },
  {
    label: '开关',
    value: 'Switch',
  },
  {
    label: '上传',
    value: 'Upload',
  },
  {
    label: '图标',
    value: 'IconPicker',
  },
  {
    label: '树形选择',
    value: 'ApiTreeSelect',
  },
  {
    label: '树',
    value: 'ApiTree',
  },
];

export const defaultTableSchemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: '表名',
    colProps: {
      span: 7,
    },
    required: true,
  },
  {
    field: 'comment',
    component: 'Input',
    label: '表注释',
    colProps: {
      span: 7,
    },
    required: true,
  },
];

export const fieldSchemas: FormSchema[] = [
  {
    field: 'field',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 4,
    },
    componentProps: {
      placeholder: '字段名称',
    },
  },
  {
    field: 'comment',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 4,
    },
    componentProps: {
      placeholder: '字段备注',
    },
  },
  {
    field: 'length',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 3,
    },
    componentProps: {
      placeholder: '长度/值',
    },
  },
  {
    field: 'default',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 4,
    },
    componentProps: {
      placeholder: '默认值',
    },
  },
  {
    field: 'type',
    component: 'Select',
    label: ' ',
    colProps: {
      span: 4,
    },
    componentProps: {
      options,
    },
  },
  {
    field: 'primary_key',
    component: 'Checkbox',
    label: ' ',
    colProps: {
      span: 1,
    },
  },
  {
    field: 'auto_increment',
    component: 'Checkbox',
    label: ' ',
    colProps: {
      span: 1,
    },
  },
  {
    field: 'nullable',
    component: 'Checkbox',
    label: ' ',
    colProps: {
      span: 1,
    },
  },
  {
    field: '0',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 2,
    },
    slot: 'add',
  },
];

export const defaultKeySchemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 6,
    },
    componentProps: {
      placeholder: '索引名',
    },
  },
  {
    field: 'columns',
    component: 'Select',
    label: ' ',
    colProps: {
      span: 6,
    },
    componentProps: {
      mode: 'multiple',
    },
    defaultValue: [],
  },
  {
    field: 'type',
    component: 'Select',
    label: ' ',
    colProps: {
      span: 6,
    },
    componentProps: {
      options: [
        {
          label: 'normal',
          value: 'normal',
        },
        {
          label: 'unique',
          value: 'unique',
        },
      ],
    },
    defaultValue: 'normal',
  },
  {
    field: '0',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 2,
    },
    slot: 'add',
  },
];

export function getDefaultFieldSchemas(): FormSchema[] {
  return [
    {
      field: 'field[0]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 4,
      },
      defaultValue: 'id',
      required: true,
      componentProps: {
        placeholder: '字段名称',
      },
    },
    {
      field: 'comment[0]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 4,
      },
      defaultValue: '主键',
      componentProps: {
        placeholder: '字段备注',
      },
    },
    {
      field: 'length[0]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 3,
      },
      defaultValue: '11',
      componentProps: {
        placeholder: '长度/值',
      },
    },
    {
      field: 'default[0]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 4,
      },
      componentProps: {
        placeholder: '默认值',
      },
    },
    {
      field: 'type[0]',
      component: 'Select',
      label: ' ',
      colProps: {
        span: 4,
      },
      defaultValue: 'unsignedInteger',
      required: true,
      componentProps: {
        options,
      },
    },
    {
      field: 'primary_key[0]',
      component: 'Checkbox',
      label: ' ',
      defaultValue: true,
      colProps: {
        span: 1,
      },
    },
    {
      field: 'auto_increment[0]',
      component: 'Checkbox',
      label: ' ',
      defaultValue: true,
      colProps: {
        span: 1,
      },
    },
    {
      field: 'nullable[0]',
      component: 'Checkbox',
      label: ' ',
      colProps: {
        span: 1,
      },
    },
    {
      field: '0',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 2,
      },
      slot: 'add',
    },
    // ====
    {
      field: 'field[1]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 4,
      },
      defaultValue: 'created_at',
      required: true,
      componentProps: {
        placeholder: '字段名称',
      },
    },
    {
      field: 'comment[1]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 4,
      },
      defaultValue: '创建时间',
      componentProps: {
        placeholder: '字段备注',
      },
    },
    {
      field: 'length[1]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 3,
      },
      componentProps: {
        placeholder: '长度/值',
      },
    },
    {
      field: 'default[1]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 4,
      },
      componentProps: {
        placeholder: '默认值',
      },
    },
    {
      field: 'type[1]',
      component: 'Select',
      label: ' ',
      colProps: {
        span: 4,
      },
      defaultValue: 'dateTime',
      required: true,
      componentProps: {
        options,
      },
    },
    {
      field: 'primary_key[1]',
      component: 'Checkbox',
      label: ' ',
      colProps: {
        span: 1,
      },
    },
    {
      field: 'auto_increment[1]',
      component: 'Checkbox',
      label: ' ',
      colProps: {
        span: 1,
      },
    },
    {
      field: 'nullable[1]',
      component: 'Checkbox',
      label: ' ',
      colProps: {
        span: 1,
      },
    },
    {
      field: '1',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 2,
      },
      slot: 'add',
    },

    // =====
    {
      field: 'field[2]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 4,
      },
      defaultValue: 'updated_at',
      required: true,
      componentProps: {
        placeholder: '字段名称',
      },
    },
    {
      field: 'comment[2]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 4,
      },
      defaultValue: '更新时间',
      componentProps: {
        placeholder: '字段备注',
      },
    },
    {
      field: 'length[2]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 3,
      },
      componentProps: {
        placeholder: '长度/值',
      },
    },
    {
      field: 'default[2]',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 4,
      },
      componentProps: {
        placeholder: '默认值',
      },
    },
    {
      field: 'type[2]',
      component: 'Select',
      label: ' ',
      colProps: {
        span: 4,
      },
      defaultValue: 'dateTime',
      required: true,
      componentProps: {
        options,
      },
    },
    {
      field: 'primary_key[2]',
      component: 'Checkbox',
      label: ' ',
      colProps: {
        span: 1,
      },
    },
    {
      field: 'auto_increment[2]',
      component: 'Checkbox',
      label: ' ',
      colProps: {
        span: 1,
      },
    },
    {
      field: 'nullable[2]',
      component: 'Checkbox',
      label: ' ',
      colProps: {
        span: 1,
      },
    },
    {
      field: '2',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 2,
      },
      slot: 'add',
    },
  ];
}
