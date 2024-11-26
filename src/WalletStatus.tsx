import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Heading, Text, Flex, Box, Card } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";

export function WalletStatus() {
  const account = useCurrentAccount();

  return (
    <Container my="4">
      <Card
        p="4"
        borderRadius="lg"
        shadow="sm"
        style={{
          backgroundColor: "var(--gray-a2)",
          border: "1px solid var(--gray-a3)",
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
            <Box style={{ wordWrap: "break-word", background: "var(--gray-a4)", padding: "8px", borderRadius: "4px" }}>
              <Text size="2" style={{ color: "var(--gray-12)" }}>
                Address:
              </Text>
              <Text size="2" weight="medium">
                {account.address}
              </Text>
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
        mt="4"
        p="4"
        borderRadius="lg"
        shadow="sm"
        style={{
          backgroundColor: "var(--gray-a1)",
          border: "1px solid var(--gray-a3)",
        }}
      >
        <Heading mb="3" size="2" weight="medium">
          Owned Objects
        </Heading>
        <OwnedObjects />
      </Card>
    </Container>
  );
}
