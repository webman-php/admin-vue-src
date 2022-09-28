<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'title'">
          <div style="text-align: left"> {{ text }} </div>
        </template>

        <template v-if="column.key === 'author'">
          <Tag color="green" v-if="text === '官方'"> {{ text }} </Tag>
          <template v-else> {{ text }} </template>
        </template>

        <template v-if="column.key === 'state'">
          <Switch
            checked-children="开启"
            un-checked-children="禁用"
            default-checked
            class="extra"
            v-model:checked="record.state"
            @change="onStateChanged(record)"
          />
        </template>

        <template v-if="column.key === 'version'">
          <template v-if="record.installed"> {{ record.installed }} </template>
          <template v-else> {{ text }} </template>
        </template>

        <template v-if="column.key === 'price'">
          <TypographyText v-if="text == 0" type="success">免费</TypographyText>
          <TypographyText v-else type="danger">{{ text }}¥</TypographyText>
        </template>

        <template v-if="column.key === 'installed'">
          <template v-if="record.installed">
            <a-button
              type="danger"
              v-if="record.name !== 'admin'"
              size="small"
              :disabled="record.disabled"
              @click="showConfirmUninstall(record.name, record.installed)"
              >卸载</a-button
            >
          </template>
          <template v-else>
            <a-button
              type="success"
              :disabled="record.disabled"
              size="small"
              @click="install(record.name, record.version)"
              >安装</a-button
            >
          </template>

          <DropdownButton
            @click="install(record.name, record.version, record.installed)"
            size="small"
            :type="record.version === record.installed ? 'info' : 'success'"
            :disabled="record.disabled"
            v-if="record.installed && record.releases && record.releases.length > 1"
          >
            {{ record.version === record.installed ? '降级' : '升级' }}
            <template #overlay>
              <Menu>
                <template v-for="item in record.releases" :key="item">
                  <MenuItem
                    :disabled="item === record.installed"
                    @click="install(record.name, item, record.installed)"
                    >{{ item }}</MenuItem
                  >
                </template>
              </Menu>
            </template>
            <template #icon><DownOutlined /></template>
          </DropdownButton>
        </template>
      </template>
    </BasicTable>

    <ModalLogin @register="register" :height="350" :width="450" />
  </div>
</template>
<script lang="ts">
  import { createVNode, defineComponent, onBeforeMount } from 'vue';
  import { Tag, Switch, DropdownButton, MenuItem, Menu, TypographyText } from 'ant-design-vue';
  import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { apiPost, apiGet, getApi } from '/@/api/common';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ModalLogin from './Login.vue';
  import { useModal } from '/@/components/Modal';
  import { Modal } from 'ant-design-vue';
  import { useLoading } from '/@/components/Loading';

  const selectUrl = '/app/admin/plugin/app/list';
  const schemaUrl = '/app/admin/plugin/app/schema';

  export default defineComponent({
    components: {
      BasicTable,
      Tag,
      Switch,
      ModalLogin,
      DropdownButton,
      Menu,
      MenuItem,
      DownOutlined,
      TypographyText,
    },
    setup() {
      const { createMessage } = useMessage();
      const { success, error } = createMessage;
      const [register, { openModal: openModal }] = useModal();
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '处理中...',
      });

      onBeforeMount(async () => {
        setColumns(await apiGet(schemaUrl));
      });

      const showConfirmUninstall = (name, version) => {
        confirm('确定卸载？', '', function () {
          uninstall(name, version);
        });
      };

      const confirm = (title, content, ok) => {
        Modal.confirm({
          centered: true,
          title: () => title,
          icon: () => createVNode(ExclamationCircleOutlined),
          content: () => createVNode('div', { style: 'color:red;' }, content),
          onOk() {
            ok();
          },
          class: 'test',
        });
      };

      async function install(name, version, installed) {
        if (installed == version) {
          return;
        }
        openFullLoading();
        try {
          const result = await apiPost(
            '/app/admin/plugin/app/install',
            {
              name,
              version,
            },
            {
              timeout: 60000,
            },
          );
          if (result.code == 401) {
            openModal();
            return;
          }
          if (result.code) {
            error(result.message);
            return;
          }
          success('安装成功');
          setTimeout(() => {
            location.reload();
          }, 1000);
        } catch (e) {
        } finally {
          closeFullLoading();
        }
      }

      async function uninstall(name, version) {
        try {
          openFullLoading();
          await apiPost('/app/admin/plugin/app/uninstall', { name, version });
        } catch (e) {
          closeFullLoading();
          return;
        }
        closeFullLoading();
        setTimeout(() => {
          location.reload();
        }, 1000);
        success('卸载成功');
      }

      function onStateChanged(record) {
        console.log(record);
      }

      const [registerTable, { reload, setColumns }] = useTable({
        api: getApi(selectUrl),
        bordered: true,
        showTableSetting: true,
      });

      return {
        registerTable,
        reload,
        onStateChanged,
        install,
        uninstall,
        register,
        showConfirmUninstall,
      };
    },
  });
</script>

<style>
  .ant-dropdown-button {
    margin-left: 8px !important;
  }

  .ant-typography.ant-typography-success {
    color: #4ba729 !important;
  }
</style>
