use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod error;
pub mod randomness_tools;
pub mod recent_blockhashes;

pub use instructions::*;

declare_id!("CU43DkuZRWt6VrY4S2hDWyc7vrcN2xDnuUwybXy2TZer");

#[program]
pub mod raffles {
    use super::*;

    pub fn add_prize(
        ctx: Context<AddPrize>,
        prize_index: u32,
        amount: u64,
    ) -> Result<()> {
        instructions::add_prize::add_prize(ctx, prize_index, amount)
    }

    pub fn buy_tickets(
        ctx: Context<BuyTickets>,
        amount: u32
    ) -> Result<()> {
        instructions::buy_tickets::buy_tickets(ctx, amount)
    }

    pub fn claim_prize(
        ctx: Context<ClaimPrize>,
        prize_index: u32, 
        ticket_index: u32,
    ) -> Result<()> {
        instructions::claim_prize::claim_prize(ctx, prize_index, ticket_index)
    }

    pub fn close_entrants(
        ctx: Context<CloseEntrants>,
    ) -> Result<()> {
        instructions::close_entrants::close_entrants(ctx)
    }

    pub fn collect_proceeds(
        ctx: Context<CollectProceeds>,
    ) -> Result<()> {
        instructions::collect_proceeds::collect_proceeds(ctx)
    }

    pub fn create_raffle(
        ctx: Context<CreateRaffle>,
        end_timestamp: i64, 
        ticket_price: u64, 
        max_entrants: u32,
    ) -> Result<()> {
        instructions::create_raffle::create_raffle(ctx, end_timestamp, ticket_price, max_entrants)
    }

    pub fn reveal_winners(
        ctx: Context<RevealWinners>,
    ) -> Result<()> {
        instructions::reveal_winners::reveal_winners(ctx)
    }

}

#[derive(Accounts)]
pub struct Initialize {}
