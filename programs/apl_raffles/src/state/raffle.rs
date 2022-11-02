use anchor_lang::prelude::*;

#[account]
#[derive(Default, Debug)]
pub struct Raffle {
    pub creator: Pubkey,
    pub total_prizes: u32,
    pub claimed_prizes: u32,
    pub randomness: Option<[u8; 32]>,
    pub end_timestamp: i64,
    pub ticket_price: u64,
    pub entrants: Pubkey,
}
