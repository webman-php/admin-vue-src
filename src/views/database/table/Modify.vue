<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    :title="title"
    @ok="handleSubmit"
    :afterClose="onTabClose"
  >
    <div class="mt-3">
      <BasicForm ref="tableElRef" :labelWidth="75" :showActionButtonGroup="false" />
    </div>
    <Card
      :tab-list="tabListTitle"
      v-bind="$attrs"
      :active-tab-key="activeKey"
      @tab-change="onTabChange"
    >
      <div v-show="activeKey === 'fieldTab'">
        <div class="ant-row pb-2 b">
          <div class="ant-col-4 pl-2 align-center"> 字段</div><div class="ant-col-4"> 备注</div
          ><div class="ant-col-3 pl-2">长度/值</div><div class="ant-col-4 pl-2">默认值</div
          ><div class="ant-col-4 pl-2">类型</div><div class="ant-col-1">主键</div
          ><div class="ant-col-1">自增</div><div class="ant-col-1">允许空</div
          ><div class="ant-col-2 pl-2">操作</div>
        </div>

        <BasicForm
          ref="fieldElRef"
          :labelWidth="10"
          :actionColOptions="{ span: 24 }"
          :showResetButton="false"
          :showSubmitButton="false"
        >
          <template #add="{ field }">
            <Button v-if="Number(field) === 0" @click="add">+</Button>
            <Button v-else @click="del(field)">-</Button>
          </template>
        </BasicForm>
      </div>

      <div v-show="activeKey === 'formTab'">
        <div class="ant-row pb-2 b">
          <div class="ant-col-4 pl-2"><br />字段</div><div class="ant-col-4"><br />备注</div
          ><div class="ant-col-4 pl-2"><br />控件类型</div
          ><div class="ant-col-1 pl-2">表单<br />显示</div
          ><div class="ant-col-1 pl-2">列表<br />显示</div
          ><div class="ant-col-1">支持<br />排序</div><div class="ant-col-1">是否<br />只读</div
          ><div class="ant-col-1">是否<br />查询</div
          ><div class="ant-col-2 pl-2"><br />查询类型</div
          ><div class="ant-col-4 pl-2"><br />控件参数</div>
        </div>
        <BasicForm
          ref="formElRef"
          :labelWidth="10"
          :actionColOptions="{ span: 24 }"
          :showResetButton="false"
          :showSubmitButton="false"
        >
          <template #add="{ field }">
            <Button v-if="Number(field) === 0" @click="add">+</Button>
            <Button v-else @click="del(field)">-</Button>
          </template>
        </BasicForm>
      </div>

      <div v-show="activeKey === 'keyTab'">
        <div class="ant-row pb-2 b">
          <div class="ant-col-6 pl-2"><br />索引名称</div><div class="ant-col-6"><br />索引字段</div
          ><div class="ant-col-6 pl-2"><br />索引类型</div>
        </div>
        <BasicForm
          ref="keyElRef"
          :labelWidth="10"
          :actionColOptions="{ span: 24 }"
          :showResetButton="false"
          :showSubmitButton="false"
        >
          <template #add="{ field }">
            <Button v-if="Number(field) === 0" @click="addKey">+</Button>
            <Button v-else @click="delKey(field)">-</Button>
          </template>
        </BasicForm>
      </div>
    </Card>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, FormActionType, FormSchema } from '/@/components/Form/index';
  import { Card } from 'ant-design-vue';
  import { Button } from '/@/components/Button';
  import { cloneDeep } from 'lodash-es';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    fieldSchemas,
    typeToControl,
    controlSelectOptions,
    defaultKeySchemas,
    getDefaultFieldSchemas,
    defaultTableSchemas,
  } from './tableData';
  import { FormCreateFields, TableCreateFields } from '/@/views/database/table/table';
  import { TableApi } from '/@/api/database/table';
  import { apiGet, apiPost } from '/@/api/common';

  const tableElRef = ref<Nullable<FormActionType>>(null);
  const fieldElRef = ref<Nullable<FormActionType>>(null);
  const formElRef = ref<Nullable<FormActionType>>(null);
  const keyElRef = ref<Nullable<FormActionType>>(null);

  let title = ref('创建表');
  let tableName = '';
  let tableSchemas: FormSchema[] = [];
  let defaultFieldSchemas: FormSchema[] = [];
  let formSchemas = {};

  const num = ref(3);
  const keyNum = ref(0);

  export default defineComponent({
    components: { BasicForm, Button, Card, BasicModal },
    emits: ['reload', 'register'],
    setup(_, { emit }) {
      const [register, { closeModal }] = useModalInner(async (data: any) => {
        tableName = data ? data.table : '';
        if (tableName) {
          title.value = '修改表';
        }
        const tableInfo = tableName
          ? await apiGet(TableApi.SCHEMA, { table: tableName })
          : { table: {} };
        tableSchemas = [];
        for (let item of defaultTableSchemas) {
          let schema = cloneDeep(item);
          schema.defaultValue = tableInfo.table[schema.field] || '';
          if (tableName && schema.field == 'name') {
            let hidden_schema = cloneDeep(schema);
            hidden_schema.field = 'old_name';
            hidden_schema.componentProps = {
              hidden: true,
            };
            hidden_schema.colProps = {
              span: 0,
            };
            hidden_schema.label = '';
            tableSchemas.push(hidden_schema);
          }
          tableSchemas.push(schema);
        }

        const tableEl = tableElRef.value;
        tableEl?.resetSchema(tableSchemas);

        defaultFieldSchemas = [];
        if (tableName) {
          for (let i in tableInfo.columns) {
            let column = tableInfo.columns[i];
            for (let j in fieldSchemas) {
              let schema: FormSchema = cloneDeep(fieldSchemas[j]);
              let f = schema.field;
              schema.defaultValue = column[f];
              if (f === 'field') {
                let hidden_schema = cloneDeep(schema);
                hidden_schema.field = `old_${f}[${i}]`;
                hidden_schema.label = '';
                hidden_schema.colProps = {
                  span: 0,
                };
                hidden_schema.componentProps = {
                  hidden: true,
                };
                defaultFieldSchemas.push(hidden_schema);
              }
              schema.field = schema.slot ? `${i}` : `${f}[${i}]`;
              defaultFieldSchemas.push(schema);
              num.value = Number(i) + 1;
            }
          }
        } else {
          defaultFieldSchemas = getDefaultFieldSchemas();
        }

        const fieldEl = fieldElRef.value;
        fieldEl?.resetSchema(defaultFieldSchemas);

        if (tableName) {
          for (let i in tableInfo.forms) {
            let form = tableInfo.forms[i];
            formSchemas[form.field] = form;
          }
        }

        const keyEl = keyElRef.value;
        keyEl?.resetSchema([]);
        const keySchemas: FormSchema[] = [];
        if (tableName) {
          for (let i in tableInfo.keys) {
            let column = tableInfo.keys[i];
            for (let j in defaultKeySchemas) {
              let schema = cloneDeep(defaultKeySchemas[j]);
              let f = schema.field;
              schema.defaultValue = column[f];
              if (tableName && f === 'name') {
                let hidden_schema = cloneDeep(schema);
                hidden_schema.field = `old_${f}[${i}]`;
                hidden_schema.label = '';
                hidden_schema.colProps = {
                  span: 0,
                };
                hidden_schema.componentProps = {
                  hidden: true,
                };
                keySchemas.push(hidden_schema);
              }
              schema.field = schema.slot ? `${i}` : `${f}[${i}]`;
              keySchemas.push(schema);
              keyNum.value = Number(i) + 1;
            }
          }
        }

        keyEl?.resetSchema(keySchemas);
        if (keyEl) {
          const data = await keyEl.validate();
          if (!Object.keys(data).length) {
            addKey();
          }
        }
        getFormColumns();
      });
      const activeKey = ref('fieldTab');
      const { createMessage } = useMessage();
      const { success } = createMessage;

      const tabListTitle = [
        {
          key: 'fieldTab',
          tab: '字段属性',
        },
        {
          key: 'formTab',
          tab: '表单属性',
        },
        {
          key: 'keyTab',
          tab: '索引',
        },
      ];

      async function onTabChange(key) {
        activeKey.value = key;
        if (key === 'formTab') {
          getFormColumns();
          return;
        }
        if (key == 'keyTab') {
          const keyEl = keyElRef.value;
          if (!keyEl) return;
          const data = await keyEl.validate();
          if (!Object.keys(data).length) {
            addKey();
          }
        }
        const forms: FormCreateFields[] = await getFormFieldsValue();
        for (let form of forms) {
          formSchemas[form.field] = form;
        }
      }

      function onTabClose() {
        onTabChange('fieldTab');
      }

      async function getColumnFieldsValue() {
        const fieldEl = fieldElRef.value;
        if (!fieldEl) return [];
        const columns: TableCreateFields[] = [];
        let i = -1;
        const data = await fieldEl.validate();
        while (i < Object.keys(data).length) {
          i++;
          if (!data[`field[${i}]`]) continue;
          columns.push({
            old_field: data[`old_field[${i}]`],
            field: data[`field[${i}]`],
            type: data[`type[${i}]`],
            comment: data[`comment[${i}]`] || null,
            length: data[`length[${i}]`] || null,
            default: data[`default[${i}]`] || null,
            nullable: data[`nullable[${i}]`] || false,
            primary_key: data[`primary_key[${i}]`] || false,
            auto_increment: data[`auto_increment[${i}]`] || false,
          });
        }
        return columns;
      }

      async function getFormFieldsValue() {
        const formEl = formElRef.value;
        if (!formEl) return [];
        const columns: FormCreateFields[] = [];
        let i = -1;
        const data = await formEl.validate();
        while (i < Object.keys(data).length) {
          i++;
          if (!data[`field[${i}]`]) continue;
          columns.push({
            field: data[`field[${i}]`],
            comment: data[`comment[${i}]`] || null,
            control: data[`control[${i}]`] || null,
            form_show: !!data[`form_show[${i}]`],
            list_show: !!data[`list_show[${i}]`],
            enable_sort: !!data[`enable_sort[${i}]`],
            readonly: !!data[`readonly[${i}]`],
            searchable: !!data[`searchable[${i}]`],
            search_type: data[`search_type[${i}]`] || 'normal',
            control_args: data[`control_args[${i}]`] || null,
          });
        }
        return columns;
      }

      async function getKeyFieldsValue() {
        const keyEl = keyElRef.value;
        if (!keyEl) return [];
        const columns = [];
        let i = -1;
        const data = await keyEl.validate();
        while (i < Object.keys(data).length) {
          i++;
          if (!data[`name[${i}]`]) continue;
          columns.push({
            old_name: data[`old_name[${i}]`] || null,
            name: data[`name[${i}]`],
            columns: data[`columns[${i}]`] || null,
            type: data[`type[${i}]`] || null,
          });
        }
        return columns;
      }

      function getFormColumns() {
        const formEl = formElRef.value;
        const fieldEl = fieldElRef.value;
        if (!formEl || !fieldEl) return;
        const fieldsValue = fieldEl.getFieldsValue();
        formEl.resetSchema([]);
        for (let i in fieldsValue.field) {
          let field: string = fieldsValue.field[i];
          let comment: string = fieldsValue.comment[i];
          let type: string = fieldsValue.type[i];
          let primary: boolean = fieldsValue.primary_key[i];
          let value: string = fieldsValue.length[i];

          formEl.appendSchemaByField(
            {
              field: `old_field[${i}]`,
              component: 'Input',
              label: ' ',
              colProps: {
                span: 0,
              },
              defaultValue: field,
              componentProps: {
                disabled: true,
                hidden: true,
              },
            },
            '',
          );
          formEl.appendSchemaByField(
            {
              field: `field[${i}]`,
              component: 'Input',
              label: ' ',
              colProps: {
                span: 4,
              },
              defaultValue: field,
              componentProps: { disabled: true },
            },
            '',
          );
          formEl.appendSchemaByField(
            {
              field: `comment[${i}]`,
              component: 'Input',
              label: ' ',
              colProps: {
                span: 4,
              },
              defaultValue: comment,
              componentProps: { disabled: true },
            },
            '',
          );
          formEl.appendSchemaByField(
            {
              field: `control[${i}]`,
              component: 'Select',
              label: ' ',
              colProps: {
                span: 4,
              },
              required: true,
              componentProps: {
                options: controlSelectOptions,
              },
              defaultValue: formSchemas[field]?.control || typeToControl(type),
            },
            '',
          );
          formEl.appendSchemaByField(
            {
              field: `form_show[${i}]`,
              component: 'Checkbox',
              label: ' ',
              colProps: {
                span: 1,
              },
              defaultValue: primary
                ? false
                : formSchemas[field]
                ? formSchemas[field].form_show
                : true,
            },
            '',
          );
          formEl.appendSchemaByField(
            {
              field: `list_show[${i}]`,
              component: 'Checkbox',
              label: ' ',
              colProps: {
                span: 1,
              },
              defaultValue: formSchemas[field] ? formSchemas[field].list_show : true,
            },
            '',
          );
          formEl.appendSchemaByField(
            {
              field: `enable_sort[${i}]`,
              component: 'Checkbox',
              label: ' ',
              colProps: {
                span: 1,
              },
              defaultValue: formSchemas[field]?.enable_sort || false,
            },
            '',
          );
          formEl.appendSchemaByField(
            {
              field: `readonly[${i}]`,
              component: 'Checkbox',
              label: ' ',
              colProps: {
                span: 1,
              },
              defaultValue: formSchemas[field]?.readonly || false,
            },
            '',
          );
          formEl.appendSchemaByField(
            {
              field: `searchable[${i}]`,
              component: 'Checkbox',
              label: ' ',
              colProps: {
                span: 1,
              },
              defaultValue: formSchemas[field]?.searchable || false,
            },
            '',
          );
          formEl.appendSchemaByField(
            {
              field: `search_type[${i}]`,
              component: 'Select',
              label: ' ',
              colProps: {
                span: 2,
              },
              componentProps: {
                options: [
                  {
                    label: '普通查询',
                    value: 'normal',
                  },
                  {
                    label: '范围查询',
                    value: 'between',
                  },
                ],
              },
              defaultValue: formSchemas[field]?.search_type || '普通查询',
            },
            '',
          );
          formEl.appendSchemaByField(
            {
              field: `control_args[${i}]`,
              component: 'Input',
              label: ' ',
              colProps: {
                span: 4,
              },
              componentProps: {
                placeholder: '',
              },
              defaultValue: formSchemas[field]?.control_args || getControlArgs(type, value),
            },
            '',
          );
        }
      }

      const getControlArgs = (type, value) => {
        if (type == 'enum') {
          let args = [];
          for (let item of value.split(',')) {
            args.push(item + ':' + item);
          }
          return 'options:' + args.join(',');
        }
        return '';
      };

      const handleSubmit = async () => {
        try {
          const tableEl = tableElRef.value;
          const formEl = formElRef.value;
          if (!tableEl || !formEl) return;
          const table = await tableEl.validate();
          const columns: TableCreateFields[] = await getColumnFieldsValue();
          const forms: FormCreateFields[] = await getFormFieldsValue();
          const keys = await getKeyFieldsValue();
          if (tableName) {
            await apiPost(TableApi.MODIFY, { table, columns, forms, keys });
          } else {
            await apiPost(TableApi.CREATE, { table, columns, forms, keys });
          }
          closeModal();
          success('操作成功');
          emit('reload');
        } catch (e) {
          console.log(e);
        }
      };

      function add() {
        const fieldEl = fieldElRef.value;
        if (!fieldEl) return;
        for (let index in fieldSchemas) {
          let schema: FormSchema = cloneDeep(fieldSchemas[index]);
          schema.field = schema.field === '0' ? String(num.value) : `${schema.field}[${num.value}]`;
          fieldEl.appendSchemaByField(schema, '');
        }
        num.value++;
      }

      function del(n) {
        const fieldEl = fieldElRef.value;
        if (!fieldEl) return;
        const fields: string[] = [];
        for (let i in fieldSchemas) {
          let schema = fieldSchemas[i];
          fields.push(schema.field == '0' ? String(n) : `${schema.field}[${n}]`);
        }
        fieldEl.removeSchemaByFiled(fields);
        num.value--;
      }

      async function addKey() {
        const keyEl = keyElRef.value;
        if (!keyEl) return;
        const columns: TableCreateFields[] = await getColumnFieldsValue();
        const options = [];
        for (let column of columns) {
          options.push({
            label: column.field,
            value: column.field,
          });
        }

        for (let index in defaultKeySchemas) {
          let schema: FormSchema = cloneDeep(defaultKeySchemas[index]);
          if (schema.field === 'columns') {
            if (schema.componentProps) schema.componentProps['options'] = options;
          }
          schema.field =
            schema.field === '0' ? String(keyNum.value) : `${schema.field}[${keyNum.value}]`;
          keyEl.appendSchemaByField(schema, '');
        }
        keyNum.value++;
      }

      function delKey(n) {
        const keyEl = keyElRef.value;
        if (!keyEl) return;
        const fields: string[] = [];
        for (let i in defaultKeySchemas) {
          let schema = defaultKeySchemas[i];
          fields.push(schema.field == '0' ? String(n) : `${schema.field}[${n}]`);
        }
        keyEl.removeSchemaByFiled(fields);
        keyNum.value--;
        if (keyNum.value < 0) {
          addKey();
        }
      }

      return {
        tableElRef,
        fieldElRef,
        formElRef,
        keyElRef,
        title,
        handleSubmit,
        tabListTitle,
        onTabChange,
        onTabClose,
        activeKey,
        del,
        add,
        addKey,
        delKey,
        register,
      };
    },
  });
</script>
