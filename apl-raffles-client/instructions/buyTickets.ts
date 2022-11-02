import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface BuyTicketsArgs {
  amount: number
}

export interface BuyTicketsAccounts {
  raffle: PublicKey
  entrants: PublicKey
  proceeds: PublicKey
  buyerTokenAccount: PublicKey
  buyerTransferAuthority: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([borsh.u32("amount")])

export function buyTickets(args: BuyTicketsArgs, accounts: BuyTicketsAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.raffle, isSigner: false, isWritable: false },
    { pubkey: accounts.entrants, isSigner: false, isWritable: true },
    { pubkey: accounts.proceeds, isSigner: false, isWritable: true },
    { pubkey: accounts.buyerTokenAccount, isSigner: false, isWritable: true },
    {
      pubkey: accounts.buyerTransferAuthority,
      isSigner: true,
      isWritable: false,
    },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([48, 16, 122, 137, 24, 214, 198, 58])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
