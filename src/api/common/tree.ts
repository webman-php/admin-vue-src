import { defHttp } from '/@/utils/http/axios';

export function treeApi(url?: string)  {
  return (params?: Recordable) =>
    defHttp.get<Recordable[]>({ url, params });
}

