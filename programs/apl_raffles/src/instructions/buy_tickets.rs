use anchor_lang::{prelude::*};
use anchor_spl::token::{TokenAccount, Token, self};

use crate::{state::{Raffle, Entrants}, error::RaffleError};

#[derive(Accounts)]
pub struct BuyTickets<'info> {
    #[account(has_one = entrants)]
    pub raffle: Account<'info, Raffle>,
    #[account(mut)]
    pub entrants: AccountLoader<'info, Entrants>,
    #[account(
        mut,
        seeds = [raffle.key().as_ref(), b"proceeds"],
        bump,
    )]
    pub proceeds: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,
    /// CHECK:
    #[account(signer)]
    pub buyer_transfer_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}


pub fn buy_tickets(ctx: Context<BuyTickets>, amount: u32) -> Result<()> {
    let clock = Clock::get()?;
    let raffle = &mut ctx.accounts.raffle;
    let mut entrants = ctx.accounts.entrants.load_mut()?;

    if clock.unix_timestamp > raffle.end_timestamp {
        return Err(error!(RaffleError::RaffleEnded));
    }

    for _ in 0..amount {
        entrants.append(ctx.accounts.buyer_token_account.owner)?;
    }

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.buyer_token_account.to_account_info(),
                to: ctx.accounts.proceeds.to_account_info(),
                authority: ctx.accounts.buyer_transfer_authority.to_account_info(),
            },
        ),
        raffle
            .ticket_price
            .checked_mul(amount as u64)
            .ok_or(RaffleError::InvalidCalculation)?,
    )?;

    msg!("Total entrants: {}", { entrants.total });

    Ok(())
}
