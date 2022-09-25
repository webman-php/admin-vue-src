<template>
  <div class="p-4">
    <BasicTable @register="registerTable" showTableSetting>
      <template #toolbar>
        <a-button type="primary" @click="openRowModal"> 添加记录 </a-button>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '删除',
              icon: 'ic:outline-delete-outline',
              popConfirm: {
                title: '是否删除？',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>

    <ModalInserOrEdit @register="register" :minHeight="300" @reload="reload" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, onBeforeMount, ref } from 'vue';
  import { BasicTable, useTable, TableAction, BasicColumn } from '/@/components/Table';
  import { apiGet, apiPost, getApi } from '/@/api/common';
  import { useModal } from '/@/components/Modal';
  import ModalInserOrEdit from '/@/views/database/table/Update.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { error } from '/@/utils/log';
  import { typeToComponent } from '/@/views/database/table/util';

  const selectUrl = '/app/admin/auth/adminrule/select';
  const insertUrl = '/app/admin/auth/adminrule/insert';
  const updateUrl = '/app/admin/auth/adminrule/update';
  const deleteUrl = '/app/admin/auth/adminrule/delete';
  const schemaUrl = '/app/admin/auth/adminrule/schema';

  const formSchemas = ref({ schemas: [] });

  export default defineComponent({
    components: { ModalInserOrEdit, BasicTable, TableAction },
    setup() {
      const { createMessage } = useMessage();
      const { success } = createMessage;
      const columns = ref([]);
      const primaryKey = ref('');
      onBeforeMount(async () => {
        const tableInfo = await apiGet(schemaUrl);
        const schemas = tableInfo.columns;
        for (let item of schemas) {
          if (item.primary_key) {
            primaryKey.value = item.field;
            break;
          }
        }
        const forms = tableInfo.forms;
        formSchemas.value.schemas = [];
        for (let item of forms) {
          if (item.searchable) {
            let [control, props] = typeToComponent(item, '', 'search');
            if (item.search_type == 'between') {
              formSchemas.value.schemas.push({
                field: `${item.field}[0]`,
                component: control,
                label: item.comment || item.field,
                colProps: {
                  offset: 1,
                  span: 5,
                },
                componentProps: props,
              });

              formSchemas.value.schemas.push({
                field: `${item.field}[1]`,
                component: control,
                label: '　到',
                colProps: {
                  span: 5,
                },
                componentProps: props,
              });
            } else {
              formSchemas.value.schemas.push({
                field: item.field,
                component: control,
                label: item.comment || item.field,
                colProps: {
                  offset: 1,
                  span: 10,
                },
                componentProps: props,
              });
            }
          }
          let column: BasicColumn = {
            dataIndex: item.field,
            title: item.comment || item.field,
            sorter: item.enable_sort,
            defaultHidden: !item.list_show,
          };
          if (['InputNumber', 'Switch'].indexOf(item.control) != -1) {
            column.width = 120;
          }
          columns.value.push(column);
        }

        if (!formSchemas.value.schemas.length) {
          nextTick(() => {
            setProps({
              useSearchForm: false,
            });
          });
        }
      });

      const [register, { openModal: openModal }] = useModal();
      const [registerTable, { reload, setProps }] = useTable({
        api: getApi(selectUrl, { format: 'table_tree' }),
        columns: columns,
        useSearchForm: true,
        bordered: true,
        isTreeTable: true,
        formConfig: formSchemas,
        pagination: false,
        actionColumn: {
          width: 250,
          title: 'Action',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      async function handleEdit(record: Recordable) {
        if (!primaryKey.value) {
          error('当前表没有主键，无法编辑');
          return;
        }
        openModal(true, {
          selectUrl,
          insertUrl,
          updateUrl,
          schemaUrl,
          column: primaryKey.value,
          value: record[primaryKey.value],
        });
      }

      async function handleDelete(record: Recordable) {
        if (!primaryKey.value) {
          error('当前表没有主键，无法删除');
          return;
        }
        await apiPost(deleteUrl, { column: primaryKey.value, value: record[primaryKey.value] });
        success('删除成功');
        reload();
      }

      function openRowModal() {
        openModal(true, {
          selectUrl,
          insertUrl,
          updateUrl,
          schemaUrl,
        });
      }

      return {
        registerTable,
        handleEdit,
        handleDelete,
        openRowModal,
        register,
        reload,
      };
    },
  });
</script>
