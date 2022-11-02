use anchor_lang::prelude::*;

use crate::error::RaffleError;

#[account(zero_copy)]
pub struct Entrants {
    pub total: u32,
    pub max: u32,
    pub entrants: [Pubkey; 5000], // ENTRANTS_SIZE
}

impl Entrants {
    pub fn append(&mut self, entrant: Pubkey) -> Result<()> {
        if self.total >= self.max {
            return Err(error!(RaffleError::NotEnoughTicketsLeft));
        }
        self.entrants[self.total as usize] = entrant;
        self.total += 1;
        Ok(())
    }
}
