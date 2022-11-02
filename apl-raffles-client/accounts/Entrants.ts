import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface EntrantsFields {
  total: number
  max: number
  entrants: Array<PublicKey>
}

export interface EntrantsJSON {
  total: number
  max: number
  entrants: Array<string>
}

export class Entrants {
  readonly total: number
  readonly max: number
  readonly entrants: Array<PublicKey>

  static readonly discriminator = Buffer.from([
    108, 213, 213, 20, 220, 134, 181, 166,
  ])

  static readonly layout = borsh.struct([
    borsh.u32("total"),
    borsh.u32("max"),
    borsh.array(borsh.publicKey(), 5000, "entrants"),
  ])

  constructor(fields: EntrantsFields) {
    this.total = fields.total
    this.max = fields.max
    this.entrants = fields.entrants
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<Entrants | null> {
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
  ): Promise<Array<Entrants | null>> {
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

  static decode(data: Buffer): Entrants {
    if (!data.slice(0, 8).equals(Entrants.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Entrants.layout.decode(data.slice(8))

    return new Entrants({
      total: dec.total,
      max: dec.max,
      entrants: dec.entrants,
    })
  }

  toJSON(): EntrantsJSON {
    return {
      total: this.total,
      max: this.max,
      entrants: this.entrants.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: EntrantsJSON): Entrants {
    return new Entrants({
      total: obj.total,
      max: obj.max,
      entrants: obj.entrants.map((item) => new PublicKey(item)),
    })
  }
}
