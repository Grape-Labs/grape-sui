import './public/global.css';
import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Avatar } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

function App() {
  return (
    <>
      <Theme radius="large">
        <Flex
          position="sticky"
          px="4"
          py="2"
          justify="between"
          style={{
            borderBottom: "1px solid var(--gray-a2)",
          }}
        >
          <Box>
            <Heading>
              
              <Avatar
                  src={"/grape_white_logo.svg"}
                  alt={"Grape Icon"}
                  size="3"
                  fallback={"Grape"}
                />

            </Heading>
          </Box>

          <Box>
            <ConnectButton />
          </Box>
        </Flex>
        <Container>
          <Container
            mt="5"
            pt="2"
            px="4"
            style={{
              borderRadius: "8px", // Equivalent to borderRadius="lg"
              background: "var(--gray-a2)", minHeight: 500
            }}
          >
            <WalletStatus />
          </Container>
        </Container>
      </Theme>
    </>
  );
}

export default App;
