import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

// Initialize the SuiClient
const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

export async function getTokenMetadata(coinType: string) {
  try {
    // Fetch detailed information about the object
    const metadata = await suiClient.getCoinMetadata({ coinType });

    if (metadata) {
      return {
        name: metadata.name,
        symbol: metadata.symbol,
        decimals: metadata.decimals,
        description: metadata.description || "No description available",
      };
    }
    return null; // Not a token or no metadata available
  } catch (error) {
    console.error(`Failed to fetch metadata for ${coinType}:`, error);
    return null;
  }
}
