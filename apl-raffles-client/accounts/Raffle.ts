import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RaffleFields {
  creator: PublicKey
  totalPrizes: number
  claimedPrizes: number
  randomness: Array<number> | null
  endTimestamp: BN
  ticketPrice: BN
  entrants: PublicKey
}

export interface RaffleJSON {
  creator: string
  totalPrizes: number
  claimedPrizes: number
  randomness: Array<number> | null
  endTimestamp: string
  ticketPrice: string
  entrants: string
}

export class Raffle {
  readonly creator: PublicKey
  readonly totalPrizes: number
  readonly claimedPrizes: number
  readonly randomness: Array<number> | null
  readonly endTimestamp: BN
  readonly ticketPrice: BN
  readonly entrants: PublicKey

  static readonly discriminator = Buffer.from([
    143, 133, 63, 173, 138, 10, 142, 200,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("creator"),
    borsh.u32("totalPrizes"),
    borsh.u32("claimedPrizes"),
    borsh.option(borsh.array(borsh.u8(), 32), "randomness"),
    borsh.i64("endTimestamp"),
    borsh.u64("ticketPrice"),
    borsh.publicKey("entrants"),
  ])

  constructor(fields: RaffleFields) {
    this.creator = fields.creator
    this.totalPrizes = fields.totalPrizes
    this.claimedPrizes = fields.claimedPrizes
    this.randomness = fields.randomness
    this.endTimestamp = fields.endTimestamp
    this.ticketPrice = fields.ticketPrice
    this.entrants = fields.entrants
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<Raffle | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<Raffle | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): Raffle {
    if (!data.slice(0, 8).equals(Raffle.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Raffle.layout.decode(data.slice(8))

    return new Raffle({
      creator: dec.creator,
      totalPrizes: dec.totalPrizes,
      claimedPrizes: dec.claimedPrizes,
      randomness: dec.randomness,
      endTimestamp: dec.endTimestamp,
      ticketPrice: dec.ticketPrice,
      entrants: dec.entrants,
    })
  }

  toJSON(): RaffleJSON {
    return {
      creator: this.creator.toString(),
      totalPrizes: this.totalPrizes,
      claimedPrizes: this.claimedPrizes,
      randomness: this.randomness,
      endTimestamp: this.endTimestamp.toString(),
      ticketPrice: this.ticketPrice.toString(),
      entrants: this.entrants.toString(),
    }
  }

  static fromJSON(obj: RaffleJSON): Raffle {
    return new Raffle({
      creator: new PublicKey(obj.creator),
      totalPrizes: obj.totalPrizes,
      claimedPrizes: obj.claimedPrizes,
      randomness: obj.randomness,
      endTimestamp: new BN(obj.endTimestamp),
      ticketPrice: new BN(obj.ticketPrice),
      entrants: new PublicKey(obj.entrants),
    })
  }
}
