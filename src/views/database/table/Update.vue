<template>
  <BasicModal v-bind="$attrs" destroyOnClose @register="register" :title="title" @ok="handleSubmit">
    <div class="mt-3">
      <BasicForm
        :schemas="schemas"
        ref="formElRef"
        :labelWidth="75"
        :showActionButtonGroup="false"
      />
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, FormActionType, FormSchema } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { uploadApi } from '/@/api/common/upload';
  import { apiGet, apiPost } from '/@/api/common';
  import { treeApi } from '/@/api/common/tree';

  const formElRef = ref<Nullable<FormActionType>>(null);
  const selectUrl = ref('');
  const insertUrl = ref('');
  const updateUrl = ref('');
  const schemaUrl = ref('');

  export default defineComponent({
    components: { BasicForm, BasicModal },
    emits: ['reload', 'register'],
    setup(_, { emit }) {
      const title = ref('添加记录');
      const table = ref('');
      const column = ref('');
      const value = ref('');
      const type = ref('insert');
      const schemas: FormSchema[] = [];
      const [register, { closeModal }] = useModalInner(async (data: any) => {
        column.value = data.column;
        value.value = data.value;
        table.value = data.table;
        selectUrl.value = data.selectUrl;
        insertUrl.value = data.insertUrl;
        updateUrl.value = data.updateUrl;
        schemaUrl.value = data.schemaUrl;

        if (column.value) {
          type.value = 'edit';
          title.value = '编辑记录';
        } else {
          type.value = 'insert';
          title.value = '插入记录';
        }
        const tableInfo = await apiGet(schemaUrl.value);
        const tableSchemas = tableInfo['forms'];
        const tableColumns = tableInfo['columns'];
        const columns = {};
        for (let item of tableColumns) {
          columns[item.field] = item;
        }
        const formEl = formElRef.value;
        if (!formEl) return;
        await formEl.resetSchema([]);
        const params = {};
        params[column.value] = value.value;
        const rows = type.value == 'edit' ? await apiGet(selectUrl.value, params) : {};
        const row = type.value == 'edit' && rows.items.length ? rows.items[0] : {};
        for (let schema of tableSchemas) {
          if (!schema.form_show) {
            continue;
          }
          let value = type.value == 'edit' ? row[schema.field] : columns[schema.field].default;
          let [component, props, defaultValue] = typeToComponent(schema, value);
          if (schema.field == 'password') {
            defaultValue = '';
            if (type.value == 'edit') props = { placeholder: '不更新密码请留空' };
          }

          formEl.appendSchemaByField(
            {
              field: schema.field,
              component: component,
              label: schema.comment || schema.field,
              colProps: {
                span: 24,
              },
              required:
                type.value == 'edit' && schema.field == 'password'
                  ? false
                  : !columns[schema.field].nullable,
              componentProps: props,
              defaultValue: defaultValue,
            },
            '',
          );
        }
      });
      const { createMessage } = useMessage();
      const { success } = createMessage;

      function typeToComponent(schema, defaultValue) {
        defaultValue = convert(defaultValue);
        let props = {
          disabled: type.value == 'edit' ? false : schema.readonly,
        };
        if (schema.control == 'Switch') {
          defaultValue = !!defaultValue;
        }
        if (schema.control == 'DatePicker') {
          props['showTime'] = true;
        }

        if (schema.control == 'ApiTreeSelect' || schema.control == 'ApiTree') {
          props['resultField'] = 'list';
          if (defaultValue) {
            if (props['multiple']) {
              if (typeof defaultValue != 'number') defaultValue = defaultValue.split(',');
            }
            //props['selectedKeys'] = defaultValue; // 设置selectedKeys后无法选中
          }
        }
        // 设置控件相关属性
        if (schema.control_args) {
          for (let item of schema.control_args.split(';')) {
            let pos = item.indexOf(':');
            if (pos == -1) continue;
            let name = item.substring(0, pos).trim();
            let values = item.substring(pos + 1).trim();
            if (schema.control == 'Upload' && name === 'url') {
              props['api'] = uploadApi(values);
              continue;
            }
            if (
              (schema.control == 'ApiTreeSelect' || schema.control == 'ApiTree') &&
              name === 'url'
            ) {
              props['api'] = treeApi(values);
              continue;
            }
            // value = a:v,c:d
            pos = values.indexOf(':');
            if (pos !== -1) {
              let options = values.split(',');
              values = [];
              for (let option of options) {
                let [value, label] = option.split(':');
                values.push({ value, label });
              }
            }
            props[name] = convert(values);
          }
        }

        if (schema.control == 'Upload') {
          if (defaultValue) {
            defaultValue = defaultValue.split(',');
            props['value'] = defaultValue;
          } else {
            props['value'] = [];
          }
          if (!props['api']) {
            props['api'] = uploadApi();
          }
        }

        return [schema.control, props, defaultValue];
      }

      function convert(value) {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (String(Number(value)) === value) {
          return Number(value);
        }
        return value;
      }

      const handleSubmit = async () => {
        try {
          const formEl = formElRef.value;
          if (!formEl) return;
          const data = await formEl.validate();
          if (type.value == 'edit') {
            await apiPost(updateUrl.value, { column: column.value, value: value.value, data });
          } else {
            await apiPost(insertUrl.value, { data });
          }

          closeModal();
          success('操作成功');
          emit('reload');
        } catch (e) {
          console.log(e);
        }
      };

      return {
        formElRef,
        handleSubmit,
        schemas,
        register,
        title,
      };
    },
  });
</script>
