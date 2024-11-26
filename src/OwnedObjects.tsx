import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Box, Card, Spinner, Avatar } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { getTokenMetadata } from "./api/getTokenMetadata";

export function OwnedObjects() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getAllCoins",
    {
      owner: account?.address as string,
    },
    {
      enabled: !!account,
    }
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
      const objectId = object?.coinType;
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
    return (
      <Flex justify="center" py="4">
        <Text color="red">Error: {error.message}</Text>
      </Flex>
    );
  }

  if (isPending || !data) {
    return (
      <Flex justify="center" align="center" minHeight="200px" py="4">
        <Spinner size="1" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" my="3" gap="2">
      <Heading size="4" style={{ textAlign: "center" }}>
        Wallet Holdings
      </Heading>

      {data.data.length === 0 ? (
        <Text>No tokens owned by the connected wallet</Text>
      ) : (
        data.data
          .filter((coin) => parseInt(coin.balance, 10) > 0)
          .map((object) => {
            const objectId = object?.coinObjectId;
            if (!objectId) return null;

            const tokenMeta = metadata[object.coinType];
            const balance =
              parseInt(object.balance, 10) /
              Math.pow(10, tokenMeta?.decimals || 0);

            return (
              <Card
                key={objectId}
                p="2"
                shadow="sm"
                borderRadius="sm"
                style={{
                  backgroundColor: "rgba(0,0,0,0.15)",
                  border: "1px solid #222",
                }}
              >
                <Flex direction="column" gap="1">
                  {/* Token Header */}
                  <Flex align="center" gap="2">
                    {/* Display SUI Icon if coinType is SUI */}
                    {object.coinType === "0x2::sui::SUI" ? (
                      <Box
                        style={{
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#111",
                          borderRadius: "50%",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          fill="none"
                          viewBox="0 0 21 26"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M16.276 10.844a7.75 7.75 0 0 1 1.695 4.848 7.804 7.804 0 0 1-1.743 4.905l-.094.116-.024-.147a7.138 7.138 0 0 0-.075-.377c-.545-2.395-2.322-4.45-5.245-6.112-1.974-1.12-3.104-2.469-3.4-4.001-.193-.99-.05-1.986.225-2.839.276-.852.685-1.566 1.033-1.995L9.785 3.85a.5.5 0 0 1 .772 0l5.72 6.993Zm1.8-1.39L10.452.134a.364.364 0 0 0-.564 0l-7.622 9.32-.025.031A10.102 10.102 0 0 0 0 15.845C0 21.455 4.554 26 10.17 26c5.618 0 10.172-4.546 10.172-10.154 0-2.408-.84-4.62-2.242-6.36l-.025-.032ZM4.09 10.814l.682-.835.02.155c.016.121.036.244.06.367.44 2.315 2.017 4.245 4.651 5.74 2.29 1.303 3.624 2.801 4.008 4.445.16.686.189 1.361.12 1.951l-.004.037-.034.016a7.778 7.778 0 0 1-3.423.789c-4.308 0-7.8-3.487-7.8-7.787 0-1.847.644-3.543 1.72-4.878Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Box>
                    ) : tokenMeta?.iconUrl ? (
                      <Avatar
                        src={tokenMeta.iconUrl}
                        alt={tokenMeta.name || "Token Icon"}
                        size="2"
                        fallback={tokenMeta?.symbol?.charAt(0) || "?"}
                      />
                    ) : (
                      <Avatar
                        size="6"
                        fallback={tokenMeta?.symbol?.charAt(0) || "?"}
                      />
                    )}
                    <Box>
                      <Text size="3" weight="bold">
                        {tokenMeta?.name || "Unknown Token"}
                      </Text>
                      {/*
                      <Text size="2" color="gray">
                        {objectId}
                      </Text>
                      */}
                    </Box>
                  </Flex>

                  {/* Token Balance */}
                  <Flex align="end" gap="1">
                    <Text size="4" weight="bold" color="blue">
                      {balance.toFixed(2)}
                    </Text>
                    <Text size="3" weight="medium">
                      {tokenMeta?.symbol || ""}
                    </Text>
                  </Flex>

                  {/* Optional Token Description */}
                  {tokenMeta?.description && (
                    <Text size="2" color="gray">
                      {tokenMeta.description}
                    </Text>
                  )}
                </Flex>
              </Card>
            );
          })
      )}
    </Flex>
  );
}
