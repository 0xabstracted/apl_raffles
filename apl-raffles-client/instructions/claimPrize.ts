import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ClaimPrizeArgs {
  prizeIndex: number
  ticketIndex: number
}

export interface ClaimPrizeAccounts {
  raffle: PublicKey
  entrants: PublicKey
  prize: PublicKey
  winnerTokenAccount: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u32("prizeIndex"),
  borsh.u32("ticketIndex"),
])

export function claimPrize(args: ClaimPrizeArgs, accounts: ClaimPrizeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.raffle, isSigner: false, isWritable: true },
    { pubkey: accounts.entrants, isSigner: false, isWritable: false },
    { pubkey: accounts.prize, isSigner: false, isWritable: true },
    { pubkey: accounts.winnerTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([157, 233, 139, 121, 246, 62, 234, 235])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      prizeIndex: args.prizeIndex,
      ticketIndex: args.ticketIndex,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
