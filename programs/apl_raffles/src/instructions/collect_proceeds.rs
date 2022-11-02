use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Token, self};

use crate::{state::Raffle, error::RaffleError};

#[derive(Accounts)]
pub struct CollectProceeds<'info> {
    #[account(has_one = creator)]
    pub raffle: Account<'info, Raffle>,
    #[account(
        mut,
        seeds = [raffle.key().as_ref(), b"proceeds"],
        bump
    )]
    pub proceeds: Account<'info, TokenAccount>,
    pub creator: Signer<'info>,
    #[account(
        mut,
        constraint = creator_proceeds.owner == creator.key()
    )]
    pub creator_proceeds: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}


pub fn collect_proceeds(ctx: Context<CollectProceeds>) -> Result<()> {
    let raffle = &ctx.accounts.raffle;

    if !raffle.randomness.is_some() {
        return Err(error!(RaffleError::WinnerNotDrawn));
    }

    let (_, nonce) = Pubkey::find_program_address(
        &[b"raffle".as_ref(), raffle.entrants.as_ref()],
        ctx.program_id,
    );
    let seeds = &[b"raffle".as_ref(), raffle.entrants.as_ref(), &[nonce]];
    let signer_seeds = &[&seeds[..]];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.proceeds.to_account_info(),
                to: ctx.accounts.creator_proceeds.to_account_info(),
                authority: ctx.accounts.raffle.to_account_info(),
            },
            signer_seeds,
        ),
        ctx.accounts.proceeds.amount,
    )?;

    Ok(())
}

