import { managementClient } from "../client";

describe("getUserPrincipalAuthenticationInfo", () => {
  let userIds: string[] = [];

  beforeAll(async () => {
    const { data } = await managementClient.listUsers({
      withCustomData: true,
      withIdentities: true,
      withDepartmentIds: true,
    });
    userIds = data.list.map((x) => x.userId);
  });

  describe("Success", () => {
    it("default", async () => {
      const { statusCode, data } =
        await managementClient.getUserPrincipalAuthenticationInfo({
          userId: userIds[0],
        });
      expect(statusCode).toEqual(200);
      expect(data.authenticated).toBeDefined();
      expect(data.principalType).toBeDefined();
      expect(data.principalCode).toBeDefined();
      expect(data.principalName).toBeDefined();
      expect(data.authenticatedAt).toBeDefined();
    });
  });

  describe("Fail", () => {
    it("userId is invalid", async () => {
      const { statusCode, message } =
        await managementClient.getUserPrincipalAuthenticationInfo({
          userId: "",
        });
      expect(statusCode).toEqual(400);
      expect(message).toEqual("参数 userId 格式错误");
    });
  });
});
