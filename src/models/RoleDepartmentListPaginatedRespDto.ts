/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RoleDepartmentListPagingDto } from './RoleDepartmentListPagingDto';

export type RoleDepartmentListPaginatedRespDto = {
    /**
     * 业务状态码，可以通过此状态码判断操作是否成功，200 表示成功。
     */
    statusCode: number;
    /**
     * 描述信息
     */
    message: string;
    /**
     * 细分错误码，可通过此错误码得到具体的错误类型。
     */
    apiCode?: number;
    /**
     * 数据
     */
    data: RoleDepartmentListPagingDto;
};
