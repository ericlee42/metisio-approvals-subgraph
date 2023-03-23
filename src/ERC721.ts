import { BigInt, store, log } from "@graphprotocol/graph-ts";
import { ERC721, Approval, ApprovalForAll } from "./generated/ERC721Approve/ERC721";
import { Token, Approved } from "./generated/schema";

export function handleERC721Approval(event: Approval): void {
  let token = Token.load(event.address.toHex());
  if (!token) {
    token = new Token(event.address.toHex());

    let callResult = ERC721.bind(event.address).try_symbol();
    if (callResult.reverted) {
      log.info("get token {} symbol reverted", [event.address.toHex()]);
      token.symbol = "Unknown Token";
    } else {
      token.symbol = callResult.value;
    }

    token.type = "ERC721";
    token.save();
  }

  const approveId = `ERC721Approve-${event.address.toHex()}-${event.params.owner}-${
    event.params.tokenId
  }`;

  let approve = Approved.load(approveId);

  if (event.params.approved.toString() === "0x0000000000000000000000000000000000000000") {
    if (approve) {
      store.remove("Approved", approveId);
    }
    return;
  }

  if (!approve) {
    approve = new Approved(approveId);
    approve.token = token.id;
    approve.owner = event.params.owner;
    approve.spender = event.params.approved;
    approve.IsAll = false;
  }

  approve.Amount = event.params.tokenId;
  approve.UpdatedAt = event.block.timestamp;
  approve.save();
}

export function handleApprovalForAll(event: ApprovalForAll): void {
  let token = Token.load(event.address.toHex());
  if (!token) {
    token = new Token(event.address.toHex());
    let callResult = ERC721.bind(event.address).try_symbol();
    if (callResult.reverted) {
      log.info("get token {} symbol reverted", [event.address.toHex()]);
      token.symbol = "Unknown Token";
    } else {
      token.symbol = callResult.value;
    }
    token.type = "ERC721";
    token.save();
  }

  const approveId = `ERC721Approve-${event.address.toHex()}-${event.params.owner}-${
    event.params.operator
  }`;

  let approve = Approved.load(approveId);
  if (!event.params.approved) {
    if (approve) {
      store.remove("Approved", approveId);
    }
    return;
  }

  if (!approve) {
    approve = new Approved(approveId);
    approve.token = token.id;
    approve.owner = event.params.owner;
    approve.spender = event.params.operator;
    approve.IsAll = true;
  }

  approve.Amount = BigInt.fromI32(0);
  approve.UpdatedAt = event.block.timestamp;
  approve.save();
}
