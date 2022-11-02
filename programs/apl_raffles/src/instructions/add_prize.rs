use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Token, Mint, self};

use crate::{state::Raffle, error::RaffleError};

#[derive(Accounts)]
#[instruction(prize_index: u32)]
pub struct AddPrize<'info> {
    #[account(mut, has_one = creator)]
    pub raffle: Account<'info, Raffle>,
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(
        init,
        seeds = [raffle.key().as_ref(), b"prize", &prize_index.to_le_bytes()],
        bump,
        payer = creator,
        token::mint = prize_mint,
        token::authority = raffle,
    )]
    pub prize: Account<'info, TokenAccount>,
    pub prize_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn add_prize(ctx: Context<AddPrize>, prize_index: u32, amount: u64) -> Result<()> {
    let clock = Clock::get()?;
    let raffle = &mut ctx.accounts.raffle;

    if clock.unix_timestamp > raffle.end_timestamp {
        return Err(error!(RaffleError::RaffleEnded));
    }

    if prize_index != raffle.total_prizes {
        return Err(error!(RaffleError::InvalidPrizeIndex));
    }

    if amount == 0 {
        return Err(error!(RaffleError::NoPrize));
    }

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.from.to_account_info(),
                to: ctx.accounts.prize.to_account_info(),
                authority: ctx.accounts.creator.to_account_info(),
            },
        ),
        amount,
    )?;

    raffle.total_prizes = raffle
        .total_prizes
        .checked_add(1)
        .ok_or(RaffleError::InvalidCalculation)?;

    Ok(())
}
