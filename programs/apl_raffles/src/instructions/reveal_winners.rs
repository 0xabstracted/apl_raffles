use anchor_lang::prelude::*;
use solana_program::sysvar;

pub const TIME_BUFFER: i64 = 20;

use crate::{error::RaffleError, state::Raffle, recent_blockhashes};

#[derive(Accounts)]
pub struct RevealWinners<'info> {
    #[account(mut)]
    pub raffle: Account<'info, Raffle>,
    /// CHECK:
    #[account(address = sysvar::recent_blockhashes::ID)]
    pub recent_blockhashes: AccountInfo<'info>,
}


pub fn reveal_winners(ctx: Context<RevealWinners>) -> Result<()> {
    let clock = Clock::get()?;
    let raffle = &mut ctx.accounts.raffle;

    let end_timestamp_with_buffer = raffle
        .end_timestamp
        .checked_add(TIME_BUFFER)
        .ok_or(RaffleError::InvalidCalculation)?;
    if clock.unix_timestamp < end_timestamp_with_buffer {
        return Err(error!(RaffleError::RaffleStillRunning));
    }

    let randomness =
        recent_blockhashes::last_blockhash_accessor(&ctx.accounts.recent_blockhashes)?;

    match raffle.randomness {
        Some(_) => return Err(error!(RaffleError::WinnersAlreadyDrawn)),
        None => raffle.randomness = Some(randomness),
    }

    Ok(())
}
