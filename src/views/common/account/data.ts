import { FormSchema } from '/@/components/Form/index';

// tab的list
export const settingList = [
  {
    key: '1',
    name: '基本设置',
    component: 'BaseSetting',
  },
  {
    key: '2',
    name: '安全设置',
    component: 'SecureSetting',
  },
];

// 基础设置 form
export const baseSetschemas: FormSchema[] = [
  {
    field: 'nickname',
    component: 'Input',
    label: '昵称',
    colProps: { span: 18 },
  },
  {
    field: 'email',
    component: 'Input',
    label: '邮箱',
    colProps: { span: 18 },
  },
  {
    field: 'mobile',
    component: 'Input',
    label: '联系电话',
    colProps: { span: 18 },
  },
];

