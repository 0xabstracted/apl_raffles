import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { AplRaffles } from "../target/types/apl_raffles";

describe("apl_raffles", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AplRaffles as Program<AplRaffles>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
