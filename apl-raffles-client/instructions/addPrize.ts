import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AddPrizeArgs {
  prizeIndex: number
  amount: BN
}

export interface AddPrizeAccounts {
  raffle: PublicKey
  creator: PublicKey
  from: PublicKey
  prize: PublicKey
  prizeMint: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.u32("prizeIndex"),
  borsh.u64("amount"),
])

export function addPrize(args: AddPrizeArgs, accounts: AddPrizeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.raffle, isSigner: false, isWritable: true },
    { pubkey: accounts.creator, isSigner: true, isWritable: true },
    { pubkey: accounts.from, isSigner: false, isWritable: true },
    { pubkey: accounts.prize, isSigner: false, isWritable: true },
    { pubkey: accounts.prizeMint, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([72, 182, 203, 140, 3, 163, 192, 98])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      prizeIndex: args.prizeIndex,
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
