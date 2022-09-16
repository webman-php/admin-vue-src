import { defHttp } from '/@/utils/http/axios';
import { deepMerge } from '/@/utils';

export const apiGet = async (url, params?, config?, opitons?) =>
  defHttp.get(
    deepMerge(
      {
        url: url,
        params,
        headers: {
          // @ts-ignore
          ignoreCancelToken: true,
        },
      },
      config,
    ),
    opitons,
  );

export const apiPost = async (url, params, config?, opitons?) =>
  defHttp.post(
    deepMerge(
      {
        url: url,
        params,
        headers: {
          // @ts-ignore
          ignoreCancelToken: true,
        },
      },
      config,
    ),
    opitons,
  );

export const getApi = (url, params?, config?, opitons?) => {
  return (args) => {
    return defHttp.get(
      deepMerge(
        {
          url: url,
          params: Object.assign(params || {}, args),
          headers: {
            // @ts-ignore
            ignoreCancelToken: true,
          },
        },
        config,
      ),
      opitons,
    );
  };
};
