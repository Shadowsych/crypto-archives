use anchor_lang::prelude::*;

declare_id!("BKnPxrqZnF5Sss6eGokwTAboVnXihNjeagR5qNAzR12D");

#[program]
pub mod service {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
    /*
     * Receive the base_account from the context, &mut gives us the "mutable reference" to base_account,
     * so instead of using a local copy we can make actual changes to base_account.
     */
    let base_account = &mut ctx.accounts.base_account;

    // Initialize the total number of GIFs to 0
    base_account.total_gifs = 0;
    Ok(())
  }

  pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> ProgramResult {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

    // Declare and initialize the GIF item struct
    let item = ItemStruct {
      gif_link: gif_link.to_string(),
      user_address: *user.to_account_info().key,
    };

    // Add the item into the gif_list Vector, then increment the total gifs
    base_account.gif_list.push(item);
    base_account.total_gifs += 1;
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
  /**
   * Tell Solana we want to initialize base_account, the user calling the function will be paying for the account created, and the account has 10000 bytes of data.
   * Solana works by making users pay "rent" on their accounts, or else people could infinitely store data and Solana would lose money!
   */
  #[account(init, payer = user, space = 10000)]
  pub base_account: Account<'info, BaseAccount>,

  // Data passed into the program that proves that the user calling this program owns their wallet account
  #[account(mut)]
  pub user: Signer<'info>,

  // A reference to the program that runs Solana
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
  // The URL link to the GIF
  pub gif_link: String,

  // The user's public key (wallet address)
  pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
  pub total_gifs: u64,
  pub gif_list: Vec<ItemStruct>,
}
