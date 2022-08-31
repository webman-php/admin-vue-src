<template>
  <div class="p-4">
    <BasicTable @register="registerTable" showTableSetting>
      <template #toolbar>
        <a-button type="primary" @click="openRowModal">
          添加记录
        </a-button>
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
              }
            },
          ]"
        />
      </template>
    </BasicTable>

    <ModalInserOrEdit @register="register" :minHeight="300" @reload="reload" />

  </div>
</template>
<script lang="ts">
import {defineComponent, h, nextTick, onBeforeMount, ref} from 'vue';
import {BasicTable, useTable, TableAction, BasicColumn} from '/@/components/Table';
import {apiGet, apiPost, getApi} from "/@/api/common";
import { useModal } from '/@/components/Modal';
import ModalInserOrEdit from '/@/views/database/table/Update.vue';
import {useMessage} from "/@/hooks/web/useMessage";
import {error} from "/@/utils/log";

const selectUrl = '/app/admin/user/user/select';
const insertUrl = '/app/admin/user/user/insert';
const updateUrl = '/app/admin/user/user/update';
const deleteUrl = '/app/admin/user/user/delete';
const schemaUrl = '/app/admin/user/user/schema';

const formSchemas = ref({schemas:[]});

export default defineComponent({
  components: {ModalInserOrEdit, BasicTable, TableAction },
  setup() {
    const {
      createMessage
    } = useMessage();
    const {success} = createMessage;
    const columns = ref([]);
    const primaryKey = ref('');
    onBeforeMount(async () => {
      const tableInfo =  await apiGet(schemaUrl);
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
          if (item.search_type == 'between') {
            formSchemas.value.schemas.push({
              field: `${item.field}[0]`,
              component: 'Input',
              label: item.comment || item.field,
              colProps: {
                offset: 1,
                span: 5,
              },
            });

            formSchemas.value.schemas.push({
              field: `${item.field}[1]`,
              component: 'Input',
              label: '　到',
              colProps: {
                span: 5,
              },
            });
          } else {
            formSchemas.value.schemas.push({
              field: item.field,
              component: 'Input',
              label: item.comment || item.field,
              colProps: {
                offset: 1,
                span: 10,
              },
            });
          }
        }
        if (item.list_show) {
          let column: BasicColumn = {
            dataIndex: item.field,
            title: item.comment || item.field,
            sorter: item.enable_sort,
          };
          columns.value.push(column);
          if (item.field == 'avatar') {
            column.width = 50;
            column.customRender = ({ record }) => {
              return h('img', { src: record[item.field]});
            }
          }
        }

      }

      if (!formSchemas.value.schemas.length) {
        nextTick(() => {
          setProps({
            useSearchForm: false
          });
        });
      }
    });


    const [register, { openModal: openModal }] = useModal();
    const [registerTable, { reload, setProps }] = useTable({
      api: getApi(selectUrl),
      columns: columns,
      useSearchForm: true,
      bordered: true,
      formConfig: formSchemas,
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
        value: record[primaryKey.value]
      });
    }

    async function handleDelete(record: Recordable) {
      if (!primaryKey.value) {
        error('当前表没有主键，无法删除');
        return;
      }
      await apiPost(deleteUrl, {column: primaryKey.value, value:record[primaryKey.value]});
      success('删除成功');
      reload();
    }

    function openRowModal()
    {
      openModal(true, {
        selectUrl,
        insertUrl,
        updateUrl,
        schemaUrl
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
