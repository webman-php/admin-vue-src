import { defHttp } from '/@/utils/http/axios';


export const apiGet = async (url, params?) =>
  defHttp.get({
    url: url,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

export const apiPost = async (url, params ) =>
  defHttp.post({
    url: url,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });


export const getApi = (url, params?) => {
  return (args) => {
    return defHttp.get({
      url: url,
      params: Object.assign(params || {}, args),
      headers: {
        // @ts-ignore
        ignoreCancelToken: true,
      },
    });
  }
}

