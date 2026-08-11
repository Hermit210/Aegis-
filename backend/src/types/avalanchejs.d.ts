/**
 * @avalabs/avalanchejs@5.1.0 ships .d.ts files with extensionless relative
 * specifiers (e.g. `export * from './vms'`) that don't resolve under this
 * project's moduleResolution: "NodeNext" (Node ESM requires an explicit
 * `/index.js`) — a real upstream packaging bug, not a local misconfiguration.
 * Confirmed with `tsc --traceResolution`: `Module name './vms' was not
 * resolved.` The runtime JS is fine; only the published types are broken.
 *
 * This ambient declaration covers just the surface this project actually
 * calls (PVMApi.getCurrentValidators, PVMApi.getTxJson), typed against
 * real live Fuji responses captured before writing it — not guessed.
 */
declare module '@avalabs/avalanchejs' {
  export namespace pvm {
    interface GetCurrentValidatorsParams {
      subnetID?: string
      nodeIDs?: string[]
    }

    interface ValidatorInfo {
      nodeID: string
      weight?: string
      connected?: boolean
      uptime?: string
      [key: string]: unknown
    }

    interface GetCurrentValidatorsResponse {
      validators: ValidatorInfo[]
    }

    interface GetTxParams {
      txID: string
    }

    interface GetTxJsonResponse {
      tx: {
        unsignedTx: { genesisData?: string; [key: string]: unknown }
        [key: string]: unknown
      }
      encoding: string
    }

    class PVMApi {
      constructor(baseURL?: string)
      getCurrentValidators(params?: GetCurrentValidatorsParams): Promise<GetCurrentValidatorsResponse>
      getTxJson(params: GetTxParams): Promise<GetTxJsonResponse>
    }
  }
}
