import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateRaffleArgs {
  endTimestamp: BN
  ticketPrice: BN
  maxEntrants: number
}

export interface CreateRaffleAccounts {
  raffle: PublicKey
  entrants: PublicKey
  creator: PublicKey
  proceeds: PublicKey
  proceedsMint: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.i64("endTimestamp"),
  borsh.u64("ticketPrice"),
  borsh.u32("maxEntrants"),
])

export function createRaffle(
  args: CreateRaffleArgs,
  accounts: CreateRaffleAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.raffle, isSigner: false, isWritable: true },
    { pubkey: accounts.entrants, isSigner: false, isWritable: true },
    { pubkey: accounts.creator, isSigner: true, isWritable: true },
    { pubkey: accounts.proceeds, isSigner: false, isWritable: true },
    { pubkey: accounts.proceedsMint, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([226, 206, 159, 34, 213, 207, 98, 126])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      endTimestamp: args.endTimestamp,
      ticketPrice: args.ticketPrice,
      maxEntrants: args.maxEntrants,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
