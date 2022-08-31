import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';

enum Api {
  UPLOAD_FILE = '/app/admin/common/upload/file',
  UPLOAD_AVATAR = '/app/admin/common/upload/avatar',
}

export function uploadApi(url?: string)  {
  return (
    params: UploadFileParams,
    onUploadProgress: (progressEvent: ProgressEvent) => void,
  ) =>
  {
    return defHttp.uploadFile<UploadApiResult>(
      {
        url: url || Api.UPLOAD_FILE,
        onUploadProgress,
      },
      params,
    );
  }
}

export const uploadFile = (
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) =>
{
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: Api.UPLOAD_FILE,
      onUploadProgress,
    },
    params,
  );
}

export const uploadAvatar = (
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) =>
{
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: Api.UPLOAD_AVATAR,
      onUploadProgress,
    },
    params,
  );
}

