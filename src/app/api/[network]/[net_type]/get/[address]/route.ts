import * as web3 from "@solana/web3.js";

interface Params {
  network: string;
  net_type: string;
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
    } else if (params.net_type == "sui") {
    } else if (params.net_type == "aptos") {
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
