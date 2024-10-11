const express = require("express");
const { betPlacedAviator, getGameHistoryAviator, getLederData, getWalletByUserId, getMyHistoryByID, getTopRecordsAviator, cashOutFunction } = require("../controller/aviator_Start_function");
const router = express.Router();

router.post("/apply-bet-aviator-first", betPlacedAviator);
router.post("/cash-out-aviator-last", cashOutFunction);
router.get("/get-game-history", getGameHistoryAviator);
router.get("/get-ledger-data", getLederData);
router.post("/get-wallet-amount-by-id", getWalletByUserId);
router.post("/my-history-by-user-id", getMyHistoryByID);
router.get("/get-top-users", getTopRecordsAviator);
module.exports = router;
