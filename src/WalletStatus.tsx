import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Heading, Text, Flex, Box, Card } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";
import { useState } from "react";

export function WalletStatus() {
  const account = useCurrentAccount();
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "Copied" message after 2 seconds
    }
  };

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`; // Shorten address

  return (
    <Container my="4">
      <Card
        style={{
          padding: "16px", // Equivalent to p="4"
          borderRadius: "8px", // Equivalent to borderRadius="lg"
          backgroundColor: "var(--gray-a2)",
        }}
      >
        <Heading mb="3" size="2" weight="medium">
          Wallet Status
        </Heading>

        {account ? (
          <Flex direction="column" gap="2">
            <Text weight="medium" style={{ color: "var(--green-11)" }}>
              Wallet Connected
            </Text>
            <Box
              onClick={handleCopyToClipboard}
              style={{
                wordWrap: "break-word",
                background: "var(--gray-a4)",
                padding: "8px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <Text size="2" style={{ color: "var(--gray-12)" }}>
                Address:
              </Text>
              <Text size="2" weight="medium">
                {shortenAddress(account.address)}
              </Text>
              {copied && (
                <Text size="1" weight="bold" style={{ color: "var(--green-11)" }}>
                  Copied to clipboard!
                </Text>
              )}
            </Box>
          </Flex>
        ) : (
          <Flex direction="column" align="center" gap="3">
            <Text weight="medium" style={{ color: "var(--red-11)" }}>
              Wallet Not Connected
            </Text>
          </Flex>
        )}
      </Card>

      {/* Owned Objects Section */}
      <Card
        style={{
          marginTop: "16px", // Equivalent to mt="4"
          padding: "16px", // Equivalent to p="4"
          borderRadius: "8px", // Equivalent to borderRadius="lg"
          backgroundColor: "var(--gray-a1)",
        }}
      >
        <OwnedObjects />
      </Card>
    </Container>
  );
}
