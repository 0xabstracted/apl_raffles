import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RevealWinnersAccounts {
  raffle: PublicKey
  recentBlockhashes: PublicKey
}

export function revealWinners(accounts: RevealWinnersAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.raffle, isSigner: false, isWritable: true },
    { pubkey: accounts.recentBlockhashes, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([24, 167, 123, 197, 91, 200, 146, 3])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
