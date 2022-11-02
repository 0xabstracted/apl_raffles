use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Token, self};

use crate::{state::{Raffle, Entrants}, error::RaffleError, randomness_tools};

#[derive(Accounts)]
#[instruction(prize_index: u32)]
pub struct ClaimPrize<'info> {
    #[account(mut, has_one = entrants)]
    pub raffle: Account<'info, Raffle>,
    pub entrants: AccountLoader<'info, Entrants>,
    #[account(
        mut,
        seeds = [raffle.key().as_ref(), b"prize", &prize_index.to_le_bytes()],
        bump,
    )]
    pub prize: Account<'info, TokenAccount>,
    #[account(mut)]
    pub winner_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}


pub fn claim_prize(
    ctx: Context<ClaimPrize>,
    prize_index: u32,
    ticket_index: u32,
) -> Result<()> {
    let raffle_account_info = ctx.accounts.raffle.to_account_info();
    let raffle = &mut ctx.accounts.raffle;

    let randomness = match raffle.randomness {
        Some(randomness) => randomness,
        None => return Err(error!(RaffleError::WinnerNotDrawn)),
    };

    let entrants = ctx.accounts.entrants.load()?;

    let winner_rand = randomness_tools::expand(randomness, prize_index);
    let winner_index = winner_rand % entrants.total;

    msg!(
        "Ticket {} attempts claiming prize {} (winner is {})",
        ticket_index,
        prize_index,
        winner_index
    );
    msg!("{} {}", winner_rand, winner_index);
    if ticket_index != winner_index {
        return Err(error!(RaffleError::TicketHasNotWon));
    }

    if ctx.accounts.winner_token_account.owner.key() != entrants.entrants[ticket_index as usize]
    {
        return Err(error!(RaffleError::TokenAccountNotOwnedByWinner));
    }

    if ctx.accounts.prize.amount == 0 {
        return Err(error!(RaffleError::NoPrize));
    }

    let (_, nonce) = Pubkey::find_program_address(
        &[b"raffle".as_ref(), raffle.entrants.as_ref()],
        ctx.program_id,
    );
    let seeds = &[b"raffle".as_ref(), raffle.entrants.as_ref(), &[nonce]];
    let signer_seeds = &[&seeds[..]];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info().clone(),
            token::Transfer {
                from: ctx.accounts.prize.to_account_info(),
                to: ctx.accounts.winner_token_account.to_account_info(),
                authority: raffle_account_info,
            },
            signer_seeds,
        ),
        ctx.accounts.prize.amount,
    )?;

    raffle.claimed_prizes = raffle
        .claimed_prizes
        .checked_add(1)
        .ok_or(RaffleError::InvalidCalculation)?;

    Ok(())
}
