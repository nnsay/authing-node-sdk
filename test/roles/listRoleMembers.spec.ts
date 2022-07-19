import { TargetDto } from "../../src/models";
import {
  generateRandomString,
} from "../../src/utils/index";
import { managementClient } from "../client";

//listRoleMembers
describe("listRoleMembers", () => {
  //定义
  const code = generateRandomString(4);
  const namespace = "default";
  const description = generateRandomString(5);
  var user = [""]

  //构造
  beforeAll(async () => {
    //创建角色
    await managementClient.createRole({
      code,
      namespace,
      description,
    });
    //创建用户
    const { statusCode, data, message } =
      await managementClient.createUsersBatch({
        list: [
          { username: generateRandomString(7) },
          { username: generateRandomString(7) }
        ]
      })
    data.forEach(element => user.push(element.userId));
    user.shift()
    //分配角色
    await managementClient.assignRole({
      code,
      namespace,
      targets: [
        { targetType: TargetDto.targetType.USER, targetIdentifier: user[0] },
        { targetType: TargetDto.targetType.USER, targetIdentifier: user[1] },
      ]
    });
  });

  //析构
  afterAll(async () => {
    //删除角色
    await managementClient.deleteRolesBatch({
      codeList: [code],
      namespace,
    });
    //删除用户
    await managementClient.deleteUsersBatch({
      userIds: user
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
      } = await managementClient.listRoleMembers({
        code,
        namespace,
      });
      //处理
      expect(statusCode).toEqual(200);
      expect(role.totalCount).toBeGreaterThanOrEqual(2);
    });

    //没有 namespace
    it("no namespace", async () => {
      //请求
      const {
        statusCode,
        data: role,
        message,
      } = await managementClient.listRoleMembers({
        code,
      });
      //处理
      expect(statusCode).toEqual(200);
      expect(role.totalCount).toBeGreaterThanOrEqual(2);
    });
  });

  //失败
  describe("Fail", () => {
    //错误 code
    it("error code", async () => {
      //定义
      const code = generateRandomString(4);
      //请求
      const {
        statusCode,
        data: role,
        message,
      } = await managementClient.listRoleMembers({
        code,
        namespace,
      });
      //处理
      expect(statusCode).not.toEqual(200);
      expect(message).toMatch("角色不存在");
    });

    //错误 namespace
    it("error namespace", async () => {
      //定义
      const namespace = generateRandomString(5);
      //请求
      const {
        statusCode,
        data: role,
        message,
      } = await managementClient.listRoleMembers({
        code,
        namespace,
      });
      //处理
      expect(statusCode).not.toEqual(200);
      expect(message).toMatch("权限组不存在");
    });
  });
});
