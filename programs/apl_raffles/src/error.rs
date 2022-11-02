use anchor_lang::prelude::*;

#[error_code]
pub enum RaffleError {
    #[msg("Max entrants is too large")]
    MaxEntrantsTooLarge,
    #[msg("Raffle has ended")]
    RaffleEnded,
    #[msg("Invalid prize index")]
    InvalidPrizeIndex,
    #[msg("No prize")]
    NoPrize,
    #[msg("Invalid calculation")]
    InvalidCalculation,
    #[msg("Not enough tickets left")]
    NotEnoughTicketsLeft,
    #[msg("Raffle is still running")]
    RaffleStillRunning,
    #[msg("Winner already drawn")]
    WinnersAlreadyDrawn,
    #[msg("Winner not drawn")]
    WinnerNotDrawn,
    #[msg("Invalid revealed data")]
    InvalidRevealedData,
    #[msg("Ticket account not owned by winner")]
    TokenAccountNotOwnedByWinner,
    #[msg("Ticket has not won")]
    TicketHasNotWon,
    #[msg("Unclaimed prizes")]
    UnclaimedPrizes,
    #[msg("Invalid recent blockhashes")]
    InvalidRecentBlockhashes,
    #[msg("Invalid account data")]
    InvalidAccountData,
}
