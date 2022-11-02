use anchor_lang::prelude::*;

use crate::{state::{Raffle, Entrants}, error::RaffleError};

#[derive(Accounts)]
pub struct CloseEntrants<'info> {
    #[account(has_one = creator, has_one = entrants)]
    pub raffle: Account<'info, Raffle>,
    #[account(mut, close = creator)]
    pub entrants: AccountLoader<'info, Entrants>,
    pub creator: Signer<'info>,
}


pub fn close_entrants(ctx: Context<CloseEntrants>) -> Result<()> {
    let raffle = &ctx.accounts.raffle;
    let entrants = ctx.accounts.entrants.load()?;
    if (raffle.claimed_prizes != raffle.total_prizes) && entrants.total != 0 {
        return Err(error!(RaffleError::UnclaimedPrizes));
    }

    Ok(())
}