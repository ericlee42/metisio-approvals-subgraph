import { BigInt, store, log } from "@graphprotocol/graph-ts";
import { ERC20, Approval } from "./generated/ERC20Approve/ERC20";
import { Token, Approved } from "./generated/schema";

export function handleERC20Approval(event: Approval): void {
  let token = Token.load(event.address.toHex());
  if (!token) {
    token = new Token(event.address.toHex());

    let callResult = ERC20.bind(event.address).try_symbol();
    if (callResult.reverted) {
      log.info("get token {} symbol reverted", [event.address.toHex()]);
      token.symbol = "Unknown Token";
    } else {
      token.symbol = callResult.value;
    }

    token.type = "ERC20";
    token.save();
  }

  const approveId = `ERC20Approve-${event.address.toHex()}-${
    event.params.owner
  }-${event.params.spender}`;

  let approve = Approved.load(approveId);
  if (event.params.value.equals(BigInt.fromU32(0))) {
    if (approve) {
      store.remove("Approved", approveId);
    }
    return;
  }

  if (!approve) {
    approve = new Approved(approveId);
    approve.token = token.id;
    approve.owner = event.params.owner;
    approve.spender = event.params.spender;
    approve.IsAll = false;
  }

  approve.Amouont = event.params.value;
  approve.UpdatedAt = event.block.timestamp;
  approve.save();
}
