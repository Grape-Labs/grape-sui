import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Box, Card, Spinner } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { getTokenMetadata } from "./api/getTokenMetadata";

export function OwnedObjects() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    //"getOwnedObjects",
    "getCoins",
    {
      owner: account?.address as string,
    },
    {
      enabled: !!account,
    },
  );

  const [metadata, setMetadata] = useState<Record<string, any>>({});

  useEffect(() => {
    if (data) {
      fetchAllMetadata(data.data);
    }
  }, [data]);

  const fetchAllMetadata = async (objects: any[]) => {
    const tokenMetadata: Record<string, any> = {};
    for (const object of objects) {
      const objectId = object.data?.objectId;
      if (objectId) {
        const metadata = await getTokenMetadata(objectId);
        if (metadata) {
          tokenMetadata[objectId] = metadata;
        }
      }
    }
    setMetadata(tokenMetadata);
  };

  if (!account) {
    return null;
  }

  if (error) {
    return <Flex>Error: {error.message}</Flex>;
  }

  if (isPending || !data) {
    return (
      <Flex justify="center">
        <Spinner size="1" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" my="4" gap="3">
      {data.data.length === 0 ? (
        <Text>No objects owned by the connected wallet</Text>
      ) : (
        <>
          <Heading size="4" mb="2">
            Tokens owned by the connected wallet
          </Heading>
          {data.data.map((object) => {
            const objectId = object?.coinObjectId;
            if (!objectId) return null; // Skip objects without a valid ID

            return (
              <Card
                key={objectId}
                p="4"
                shadow="sm"
                borderRadius="lg"
                style={{
                  backgroundColor: "var(--gray-a1)",
                  border: "1px solid var(--gray-a3)",
                }}
              >
                <Box>
                  <Text size="2" weight="medium">
                    Object ID:
                  </Text>{" "}
                  <Text size="2">{objectId}</Text>
                </Box>
                <Box>
                  <Text size="2" weight="medium">
                    Object Version:
                  </Text>{" "}
                  <Text size="2">{object?.version || "Unknown"}</Text>
                </Box>
                <Box>
                  <Text size="2" weight="medium">
                  coinType:
                  </Text>{" "}
                  <Text size="2">{object?.coinType || "Unknown"}</Text>
                </Box>
                <Box>
                  <Text size="2" weight="medium">
                  Balance:
                  </Text>{" "}
                  <Text size="2">{object?.balance || "Unknown"}</Text>
                </Box>

                {/* Show Metadata */}
                {metadata[objectId] && (
                  <>
                    <Box>
                      <Text size="2" weight="medium">
                        coinType:
                      </Text>{" "}
                      <Text size="2">{metadata[objectId]?.coinType}</Text>
                    </Box>
                    <Box>
                      <Text size="2" weight="medium">
                        Balance:
                      </Text>{" "}
                      <Text size="2">{metadata[objectId]?.balance}</Text>
                    </Box>
                  </>
                )}
              </Card>
            );
          })}
        </>
      )}
    </Flex>
  );
}
