import { FormSchema } from '/@/components/Form';

export const step1Schemas: FormSchema[] = [
  {
    field: 'user',
    component: 'Input',
    label: '用户名',
    required: true,
    defaultValue: 'root',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'password',
    component: 'InputPassword',
    label: '密码',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
  },{
    field: 'database',
    component: 'Input',
    label: '数据库',
    required: true,
    defaultValue: 'webman_admin',
    colProps: {
      span: 24,
    },
  },{
    field: 'host',
    component: 'Input',
    label: 'host',
    required: true,
    defaultValue: '127.0.0.1',
    colProps: {
      span: 24,
    },
  },{
    field: 'port',
    component: 'Input',
    label: '端口',
    required: true,
    defaultValue: '3306',
    colProps: {
      span: 24,
    },
  },{
    field: 'overwrite',
    component: 'Checkbox',
    label: '强制覆盖',
    colProps: {
      span: 24,
    },
    helpMessage: "注意：强制覆盖将删除admin后台相关表的数据(不影响其它表)，并且无法恢复"
  },

];

export const step2Schemas: FormSchema[] = [
  {
    field: 'username',
    component: 'Input',
    label: '用户名',
    required: true,
    defaultValue: '',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'password',
    component: 'InputPassword',
    label: '密码',
    required: true,
    colProps: {
      span: 24,
    },
  },{
    field: 'password2',
    component: 'InputPassword',
    label: '确认密码',
    required: true,
    colProps: {
      span: 24,
    },
  }
];
