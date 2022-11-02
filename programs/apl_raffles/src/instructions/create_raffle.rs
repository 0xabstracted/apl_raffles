use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Token, Mint};

use crate::{state::{Raffle, Entrants}, error::RaffleError};

pub const ENTRANTS_SIZE: u32 = 5000;


#[derive(Accounts)]
pub struct CreateRaffle<'info> {
    #[account(
        init,
        seeds = [b"raffle".as_ref(), entrants.key().as_ref()],
        bump,
        payer = creator,
        space = 8 + 300, // Option serialization workaround
    )]
    pub raffle: Account<'info, Raffle>,
    #[account(zero)]
    pub entrants: AccountLoader<'info, Entrants>,
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        init,
        seeds = [raffle.key().as_ref(), b"proceeds"],
        bump,
        payer = creator,
        token::mint = proceeds_mint,
        token::authority = raffle,
    )]
    pub proceeds: Account<'info, TokenAccount>,
    pub proceeds_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}


pub fn create_raffle(
    ctx: Context<CreateRaffle>,
    end_timestamp: i64,
    ticket_price: u64,
    max_entrants: u32,
) -> Result<()> {
    let raffle = &mut ctx.accounts.raffle;

    raffle.creator = *ctx.accounts.creator.key;
    raffle.total_prizes = 0;
    raffle.claimed_prizes = 0;
    raffle.randomness = None;
    raffle.end_timestamp = end_timestamp;
    raffle.ticket_price = ticket_price;
    raffle.entrants = ctx.accounts.entrants.key();

    let mut entrants = ctx.accounts.entrants.load_init()?;
    if max_entrants > ENTRANTS_SIZE {
        return Err(error!(RaffleError::MaxEntrantsTooLarge));
    }
    entrants.max = max_entrants;

    Ok(())
}

