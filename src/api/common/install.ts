import { defHttp } from '/@/utils/http/axios';

enum Api {
  STEP1 = '/app/admin/common/install/step1',
  STEP2 = '/app/admin/common/install/step2',
}

export const installStep1 = async (params) =>
  defHttp.post({
    url: Api.STEP1,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const installStep2 = async (params) =>
  defHttp.post({
    url: Api.STEP2,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
