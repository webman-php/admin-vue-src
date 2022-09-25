<template>
  <div class="p-4">
    <BasicTable @register="registerTable" showTableSetting>
      <template #toolbar>
        <a-button type="primary" @click="openTableModal"> 创建表格 </a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'TABLE_ROWS'">
          <a @click="view(record.TABLE_NAME)">{{ record.TABLE_ROWS }}</a>
        </template>
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
          :dropDownActions="[
            {
              label: '一键菜单',
              onClick: handleCreateMenu.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>

    <Modal @register="register" :defaultFullscreen="true" :minHeight="100" @reload="reloadTables" />
    <ModalCreateMenu @register="createMenuRegister" :minHeight="300" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, BasicColumn, TableAction } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  import { TableApi } from '/@/api/database/table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import Modal from './Modify.vue';
  import ModalCreateMenu from './CreateMenu.vue';
  import { apiPost, getApi } from '/@/api/common';

  const columns: BasicColumn[] = [
    {
      title: '表名',
      dataIndex: 'TABLE_NAME',
      sorter: true,
    },
    {
      title: '记录数',
      dataIndex: 'TABLE_ROWS',
      sorter: true,
    },
    {
      title: '备注',
      dataIndex: 'TABLE_COMMENT',
      sorter: true,
    },
    {
      title: '引擎',
      dataIndex: 'ENGINE',
      sorter: true,
    },
    {
      title: '字符集',
      sorter: true,
      dataIndex: 'TABLE_COLLATION',
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'CREATE_TIME',
    },
  ];
  export default defineComponent({
    components: { Modal, BasicTable, TableAction, ModalCreateMenu },
    setup() {
      const [register, { openModal: openModal }] = useModal();
      const [createMenuRegister, { openModal: openCreateMenuModal }] = useModal();
      const { createMessage } = useMessage();
      const { success } = createMessage;
      const go = useGo();
      const [registerTable, { reload }] = useTable({
        title: '所有表',
        api: getApi(TableApi.SHOW),
        columns: columns,
        bordered: true,
        actionColumn: {
          width: 250,
          title: 'Action',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      function openTableModal() {
        openModal(true, { table: '' });
      }

      function reloadTables() {
        reload();
      }

      function handleEdit(record: Recordable) {
        openModal(true, { table: record.TABLE_NAME });
      }

      async function handleDelete(record: Recordable) {
        await apiPost(TableApi.DROP, { table: record.TABLE_NAME });
        success('删除成功');
        reload();
      }

      async function handleCreateMenu(record: Recordable) {
        openCreateMenuModal(true, { table: record.TABLE_NAME });
      }

      function handleOpen(record: Recordable) {
        console.log('点击了启用', record);
      }

      function view(tableName) {
        go(`/database/table/view/${tableName}`);
      }

      return {
        registerTable,
        handleEdit,
        handleDelete,
        handleOpen,
        view,
        openTableModal,
        register,
        createMenuRegister,
        reloadTables,
        handleCreateMenu,
        ModalCreateMenu,
      };
    },
  });
</script>
