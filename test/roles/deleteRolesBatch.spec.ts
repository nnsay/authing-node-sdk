import {
  generateRandomString,
} from "../../src/utils/index";
import { managementClient } from "../client";

//deleteRolesBatch
describe("deleteRolesBatch", () => {
  //定义
  const code = generateRandomString(4);
  const namespace = "default";
  const description = generateRandomString(5);

  //构造
  beforeAll(async () => {
    //创建角色
    await managementClient.createRole({
      code,
      namespace,
      description,
    });
  });

  //析构
  afterAll(async () => {
    //删除角色
    await managementClient.deleteRolesBatch({
      codeList: [code],
      namespace,
    });
  });

  //成功
  describe("Success", () => {
    //默认
    it("default", async () => {
      //请求
      const {
        statusCode,
        data: role,
        message,
      } = await managementClient.deleteRolesBatch({
        codeList: [code],
        namespace,
      });
      //处理
      expect(statusCode).toEqual(200);
    });
  });

  //失败
  describe("Fail", () => {
    //错误 codeList
    it("error codeList", async () => {
      //定义
      const code = generateRandomString(4);
      //请求
      const {
        statusCode,
        data: role,
        message,
      } = await managementClient.deleteRolesBatch({
        codeList: [code],
        namespace,
      });
      //处理
      expect(statusCode).not.toEqual(200);
      expect(message).toMatch("角色不存在");
    });

    //错误 namespace
    it("error namespace", async () => {
      //定义
      const namespace = generateRandomString(4);
      //请求
      const {
        statusCode,
        data: role,
        message,
      } = await managementClient.deleteRolesBatch({
        codeList: [code],
        namespace,
      });
      //处理
      expect(statusCode).not.toEqual(200);
      expect(message).toMatch("权限组不存在");
    });

    //空
    it("empty", async () => {
      //请求
      const {
        statusCode,
        data: role,
        message,
      } = await managementClient.deleteRolesBatch({
        codeList: [],
        namespace,
      });
      //处理
      expect(statusCode).not.toEqual(200);
      expect(message).toMatch("参数 codeList 格式错误");
    });
  });
});
