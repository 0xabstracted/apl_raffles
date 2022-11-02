export type CustomError =
  | MaxEntrantsTooLarge
  | RaffleEnded
  | InvalidPrizeIndex
  | NoPrize
  | InvalidCalculation
  | NotEnoughTicketsLeft
  | RaffleStillRunning
  | WinnersAlreadyDrawn
  | WinnerNotDrawn
  | InvalidRevealedData
  | TokenAccountNotOwnedByWinner
  | TicketHasNotWon
  | UnclaimedPrizes
  | InvalidRecentBlockhashes
  | InvalidAccountData

export class MaxEntrantsTooLarge extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "MaxEntrantsTooLarge"
  readonly msg = "Max entrants is too large"

  constructor(readonly logs?: string[]) {
    super("6000: Max entrants is too large")
  }
}

export class RaffleEnded extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "RaffleEnded"
  readonly msg = "Raffle has ended"

  constructor(readonly logs?: string[]) {
    super("6001: Raffle has ended")
  }
}

export class InvalidPrizeIndex extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "InvalidPrizeIndex"
  readonly msg = "Invalid prize index"

  constructor(readonly logs?: string[]) {
    super("6002: Invalid prize index")
  }
}

export class NoPrize extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "NoPrize"
  readonly msg = "No prize"

  constructor(readonly logs?: string[]) {
    super("6003: No prize")
  }
}

export class InvalidCalculation extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "InvalidCalculation"
  readonly msg = "Invalid calculation"

  constructor(readonly logs?: string[]) {
    super("6004: Invalid calculation")
  }
}

export class NotEnoughTicketsLeft extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "NotEnoughTicketsLeft"
  readonly msg = "Not enough tickets left"

  constructor(readonly logs?: string[]) {
    super("6005: Not enough tickets left")
  }
}

export class RaffleStillRunning extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "RaffleStillRunning"
  readonly msg = "Raffle is still running"

  constructor(readonly logs?: string[]) {
    super("6006: Raffle is still running")
  }
}

export class WinnersAlreadyDrawn extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "WinnersAlreadyDrawn"
  readonly msg = "Winner already drawn"

  constructor(readonly logs?: string[]) {
    super("6007: Winner already drawn")
  }
}

export class WinnerNotDrawn extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "WinnerNotDrawn"
  readonly msg = "Winner not drawn"

  constructor(readonly logs?: string[]) {
    super("6008: Winner not drawn")
  }
}

export class InvalidRevealedData extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "InvalidRevealedData"
  readonly msg = "Invalid revealed data"

  constructor(readonly logs?: string[]) {
    super("6009: Invalid revealed data")
  }
}

export class TokenAccountNotOwnedByWinner extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "TokenAccountNotOwnedByWinner"
  readonly msg = "Ticket account not owned by winner"

  constructor(readonly logs?: string[]) {
    super("6010: Ticket account not owned by winner")
  }
}

export class TicketHasNotWon extends Error {
  static readonly code = 6011
  readonly code = 6011
  readonly name = "TicketHasNotWon"
  readonly msg = "Ticket has not won"

  constructor(readonly logs?: string[]) {
    super("6011: Ticket has not won")
  }
}

export class UnclaimedPrizes extends Error {
  static readonly code = 6012
  readonly code = 6012
  readonly name = "UnclaimedPrizes"
  readonly msg = "Unclaimed prizes"

  constructor(readonly logs?: string[]) {
    super("6012: Unclaimed prizes")
  }
}

export class InvalidRecentBlockhashes extends Error {
  static readonly code = 6013
  readonly code = 6013
  readonly name = "InvalidRecentBlockhashes"
  readonly msg = "Invalid recent blockhashes"

  constructor(readonly logs?: string[]) {
    super("6013: Invalid recent blockhashes")
  }
}

export class InvalidAccountData extends Error {
  static readonly code = 6014
  readonly code = 6014
  readonly name = "InvalidAccountData"
  readonly msg = "Invalid account data"

  constructor(readonly logs?: string[]) {
    super("6014: Invalid account data")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new MaxEntrantsTooLarge(logs)
    case 6001:
      return new RaffleEnded(logs)
    case 6002:
      return new InvalidPrizeIndex(logs)
    case 6003:
      return new NoPrize(logs)
    case 6004:
      return new InvalidCalculation(logs)
    case 6005:
      return new NotEnoughTicketsLeft(logs)
    case 6006:
      return new RaffleStillRunning(logs)
    case 6007:
      return new WinnersAlreadyDrawn(logs)
    case 6008:
      return new WinnerNotDrawn(logs)
    case 6009:
      return new InvalidRevealedData(logs)
    case 6010:
      return new TokenAccountNotOwnedByWinner(logs)
    case 6011:
      return new TicketHasNotWon(logs)
    case 6012:
      return new UnclaimedPrizes(logs)
    case 6013:
      return new InvalidRecentBlockhashes(logs)
    case 6014:
      return new InvalidAccountData(logs)
  }

  return null
}
