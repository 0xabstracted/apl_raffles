import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CollectProceedsAccounts {
  raffle: PublicKey
  proceeds: PublicKey
  creator: PublicKey
  creatorProceeds: PublicKey
  tokenProgram: PublicKey
}

export function collectProceeds(accounts: CollectProceedsAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.raffle, isSigner: false, isWritable: false },
    { pubkey: accounts.proceeds, isSigner: false, isWritable: true },
    { pubkey: accounts.creator, isSigner: true, isWritable: false },
    { pubkey: accounts.creatorProceeds, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([244, 144, 47, 7, 238, 154, 18, 160])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
