
export interface TableCreateFields
{
  old_field ?: string,
  field: string,
  type: string,
  comment: string,
  length: number|null,
  default: string|number|null,
  nullable: boolean,
  primary_key: boolean,
  auto_increment: boolean,
}

export interface FormCreateFields
{
  field: string,
  comment: string,
  control: string,
  form_show: boolean,
  list_show: boolean,
  enable_sort: boolean,
  readonly: boolean,
  searchable: boolean,
  search_type: string,
  control_args: string,
}
