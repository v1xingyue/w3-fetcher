import {
  AccountAddress,
  Aptos,
  AptosConfig,
  NetworkToNetworkName,
} from "@aptos-labs/ts-sdk";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import * as web3 from "@solana/web3.js";

interface Params {
  network: string;
  net_type: "mainnet" | "testnet" | "devnet" | "localnet";
  address: string;
}
export async function GET(request: Request, { params }: { params: Params }) {
  const data: any = {};

  try {
    if (params.network == "solana") {
      let connection = new web3.Connection(
        web3.clusterApiUrl(params.net_type as web3.Cluster)
      );

      const info = await connection.getAccountInfo(
        new web3.PublicKey(params.address)
      );

      data.info = info;
    } else if (params.network == "sui") {
      const suiClient = new SuiClient({
        url: getFullnodeUrl(params.net_type),
      });
      const info = await suiClient.getObject({
        id: params.address,
        options: {
          showContent: true,
          showOwner: true,
          showDisplay: true,
        },
      });
      data.info = info;
    } else if (params.network == "aptos") {
      const aptosConfig = new AptosConfig({
        network: NetworkToNetworkName[params.net_type],
      });
      const aptos = new Aptos(aptosConfig);

      const info = await aptos.getAccountInfo({
        accountAddress: AccountAddress.fromStrict(params.address),
      });

      data.info = info;
    }
  } catch (error: any) {
    console.log(error);
    data.error = error.message;
  }

  return Response.json({
    ...params,
    data,
  });
}
