import { beforeEach, describe, expect, it, vi } from "vitest";
import { BlockLogsToStorageOptions, blockLogsToStorage } from "./blockLogsToStorage";
import storeConfig from "@latticexyz/store/mud.config";
import { isDefined } from "@latticexyz/common/utils";

const mockedCallbacks = {
  registerTables: vi.fn<
    Parameters<BlockLogsToStorageOptions["registerTables"]>,
    ReturnType<BlockLogsToStorageOptions["registerTables"]>
  >(),
  getTables: vi.fn<
    Parameters<BlockLogsToStorageOptions["getTables"]>,
    ReturnType<BlockLogsToStorageOptions["getTables"]>
  >(),
  storeOperations: vi.fn<
    Parameters<BlockLogsToStorageOptions["storeOperations"]>,
    ReturnType<BlockLogsToStorageOptions["storeOperations"]>
  >(),
};

const mockedDecode = blockLogsToStorage<typeof storeConfig>(
  mockedCallbacks as any as BlockLogsToStorageOptions<typeof storeConfig>
);

describe("blockLogsToStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("call setField with data properly decoded", async () => {
    mockedCallbacks.getTables.mockImplementation(async ({ tables }) => {
      return tables
        .map((table) => {
          if (table.namespace === "" && table.name === "Inventory") {
            return {
              ...table,
              keySchema: {
                owner: "address",
                item: "uint32",
                itemVariant: "uint32",
              } as const,
              valueSchema: {
                amount: "uint32",
              } as const,
            };
          }
        })
        .filter(isDefined);
    });

    const operations = await mockedDecode({
      blockNumber: 5448n,
      logs: [
        {
          address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
          topics: ["0x912af873e852235aae78a1d25ae9bb28b616a67c36898c53a14fd8184504ee32"],
          data: "0x6d756473746f72650000000000000000736368656d6100000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000496e76656e746f72790000000000000000000000000000000000000000000000000000000000000000000000000000400004010003000000000000000000000000000000000000000000000000000000002001005f000000000000000000000000000000000000000000000000000000",
          blockNumber: 5448n,
          transactionHash: "0x2766c01dd2290a80e2b54c27e95ca303d7d362643a68bd71c7d8fdb620f2a3a6",
          transactionIndex: 18,
          blockHash: "0xc65212ced76e80c3d59fd210fca434d9ceebfc25b544989d5eaecec3d31f9ac9",
          logIndex: 18,
          removed: false,
          args: {
            table: "0x6d756473746f72650000000000000000736368656d6100000000000000000000",
            key: ["0x00000000000000000000000000000000496e76656e746f727900000000000000"],
            data: "0x0004010003000000000000000000000000000000000000000000000000000000002001005f000000000000000000000000000000000000000000000000000000",
          },
          eventName: "StoreSetRecord",
        },
        {
          address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
          topics: ["0x912af873e852235aae78a1d25ae9bb28b616a67c36898c53a14fd8184504ee32"],
          data: "0x6d756473746f7265000000000000000053746f72654d65746164617461000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000496e76656e746f72790000000000000000000000000000000000000000000000000000000000000000000000000000c9000000000000a9000000000900000000a0000000000000000000000000000000496e76656e746f7279000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000576616c75650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 5448n,
          transactionHash: "0x80d6650fdd6656461e6639988d7baa8d6d228297df505d8bbd0a4efc273b382b",
          transactionIndex: 44,
          blockHash: "0x930656a2399ed2473449118a030cf9a3b3f770db4f74e9b565e2e0035c49bc6e",
          logIndex: 44,
          removed: false,
          args: {
            table: "0x6d756473746f7265000000000000000053746f72654d65746164617461000000",
            key: ["0x00000000000000000000000000000000496e76656e746f727900000000000000"],
            data: "0x000000000000a9000000000900000000a0000000000000000000000000000000496e76656e746f7279000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000576616c7565000000000000000000000000000000000000000000000000000000",
          },
          eventName: "StoreSetRecord",
        },
        {
          address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
          topics: ["0xd01f9f1368f831528fc9fe6442366b2b7d957fbfff3bcf7c24d9ab5fe51f8c46"],
          data: "0x00000000000000000000000000000000496e76656e746f7279000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000796eb990a3f9c431c69149c7a168b91596d87f600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000040000000800000000000000000000000000000000000000000000000000000000",
          blockHash: "0x03e962e7402b2ab295b92feac342a132111dd14b0d1fd4d4a0456fdc77981577",
          blockNumber: 5448n,
          transactionHash: "0xa6986924609542dc4c2d81c53799d8eab47109ef34ee1e422de595e19ee9bfa4",
          transactionIndex: 88,
          logIndex: 88,
          removed: false,
          args: {
            table: "0x00000000000000000000000000000000496e76656e746f727900000000000000",
            key: [
              "0x000000000000000000000000796eb990a3f9c431c69149c7a168b91596d87f60",
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              "0x0000000000000000000000000000000000000000000000000000000000000001",
            ],
            schemaIndex: 0,
            data: "0x00000008",
          },
          eventName: "StoreSetField",
        },
      ],
    });

    expect(mockedCallbacks.storeOperations).toMatchInlineSnapshot(`
      [MockFunction spy] {
        "calls": [
          [
            {
              "blockNumber": 5448n,
              "operations": [
                {
                  "key": {
                    "item": 1,
                    "itemVariant": 1,
                    "owner": "0x796eb990A3F9C431C69149c7a168b91596D87F60",
                  },
                  "log": {
                    "address": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
                    "args": {
                      "data": "0x00000008",
                      "key": [
                        "0x000000000000000000000000796eb990a3f9c431c69149c7a168b91596d87f60",
                        "0x0000000000000000000000000000000000000000000000000000000000000001",
                        "0x0000000000000000000000000000000000000000000000000000000000000001",
                      ],
                      "schemaIndex": 0,
                      "table": "0x00000000000000000000000000000000496e76656e746f727900000000000000",
                    },
                    "blockHash": "0x03e962e7402b2ab295b92feac342a132111dd14b0d1fd4d4a0456fdc77981577",
                    "blockNumber": 5448n,
                    "data": "0x00000000000000000000000000000000496e76656e746f7279000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000796eb990a3f9c431c69149c7a168b91596d87f600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000040000000800000000000000000000000000000000000000000000000000000000",
                    "eventName": "StoreSetField",
                    "logIndex": 88,
                    "removed": false,
                    "topics": [
                      "0xd01f9f1368f831528fc9fe6442366b2b7d957fbfff3bcf7c24d9ab5fe51f8c46",
                    ],
                    "transactionHash": "0xa6986924609542dc4c2d81c53799d8eab47109ef34ee1e422de595e19ee9bfa4",
                    "transactionIndex": 88,
                  },
                  "name": "Inventory",
                  "namespace": "",
                  "type": "SetField",
                  "value": 8,
                  "valueName": "amount",
                },
              ],
            },
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `);

    expect(operations).toMatchInlineSnapshot(`
      {
        "blockNumber": 5448n,
        "operations": [
          {
            "key": {
              "item": 1,
              "itemVariant": 1,
              "owner": "0x796eb990A3F9C431C69149c7a168b91596D87F60",
            },
            "log": {
              "address": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
              "args": {
                "data": "0x00000008",
                "key": [
                  "0x000000000000000000000000796eb990a3f9c431c69149c7a168b91596d87f60",
                  "0x0000000000000000000000000000000000000000000000000000000000000001",
                  "0x0000000000000000000000000000000000000000000000000000000000000001",
                ],
                "schemaIndex": 0,
                "table": "0x00000000000000000000000000000000496e76656e746f727900000000000000",
              },
              "blockHash": "0x03e962e7402b2ab295b92feac342a132111dd14b0d1fd4d4a0456fdc77981577",
              "blockNumber": 5448n,
              "data": "0x00000000000000000000000000000000496e76656e746f7279000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000796eb990a3f9c431c69149c7a168b91596d87f600000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000040000000800000000000000000000000000000000000000000000000000000000",
              "eventName": "StoreSetField",
              "logIndex": 88,
              "removed": false,
              "topics": [
                "0xd01f9f1368f831528fc9fe6442366b2b7d957fbfff3bcf7c24d9ab5fe51f8c46",
              ],
              "transactionHash": "0xa6986924609542dc4c2d81c53799d8eab47109ef34ee1e422de595e19ee9bfa4",
              "transactionIndex": 88,
            },
            "name": "Inventory",
            "namespace": "",
            "type": "SetField",
            "value": 8,
            "valueName": "amount",
          },
        ],
      }
    `);
  });
});
