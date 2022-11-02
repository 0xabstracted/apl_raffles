import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CloseEntrantsAccounts {
  raffle: PublicKey
  entrants: PublicKey
  creator: PublicKey
}

export function closeEntrants(accounts: CloseEntrantsAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.raffle, isSigner: false, isWritable: false },
    { pubkey: accounts.entrants, isSigner: false, isWritable: true },
    { pubkey: accounts.creator, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([241, 25, 87, 232, 155, 81, 232, 179])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
