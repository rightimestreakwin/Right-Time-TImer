const schedule = require("node-cron");
const {
  queryDb,
  functionToreturnDummyResult,
} = require("../helper/adminHelper");
const moment = require("moment");
const soment = require("moment-timezone");
const { default: axios } = require("axios");
exports.sendWingoAmountToTheAdmin = async (io) => {
  try {
    const data = await queryDb(
      "SELECT `slot_num`,`game_type`,`round_no`,`mid_amount` FROM wingo_get_amount_on_slot WHERE `game_type` = 1;",
      []
    );
    io.emit("oneminwingoamount", JSON.stringify(data || ""));
  } catch (e) {
    console.log(e);
  }
};
exports.sendWingoAmountToTheAdminThreeMin = async (io) => {
  try {
    const data = await queryDb(
      "SELECT `slot_num`,`game_type`,`round_no`,`mid_amount` FROM wingo_get_amount_on_slot WHERE `game_type` = 2;",
      []
    );
    io.emit("oneminwingoamountthreemin", JSON.stringify(data || ""));
  } catch (e) {
    console.log(e);
  }
};
exports.sendWingoAmountToTheAdminFiveMin = async (io) => {
  try {
    const data = await queryDb(
      "SELECT `slot_num`,`game_type`,`round_no`,`mid_amount` FROM wingo_get_amount_on_slot WHERE `game_type` = 3;",
      []
    );
    io.emit("oneminwingoamountfivemin", JSON.stringify(data || ""));
  } catch (e) {
    console.log(e);
  }
};
exports.generatedTimeEveryAfterEveryOneMin = (io) => {
  const job = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemin", timeToSend);
  });
};

exports.generatedTimeEveryAfterEveryOneMinTRX = (io) => {
  let oneMinTrxJob = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemintrx", timeToSend);

    if (timeToSend === 6) {
      let timetosend = new Date();
      timetosend.setSeconds(54);
      timetosend.setMilliseconds(0);
      let updatedTimestamp = parseInt(timetosend.getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();
      setTimeout(async () => {
        const res = await axios
          .get(
            `https://apilist.tronscanapi.com/api/block`,
            {
              params: {
                sort: "-balance",
                start: "0",
                limit: "20",
                producer: "",
                number: "",
                start_timestamp: updatedTimestamp,
                end_timestamp: updatedTimestamp,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (result) => {
            if (result?.data?.data[0]) {
              const obj = result.data.data[0];
              sendOneMinResultToDatabase(time, obj);
            } else {
              sendOneMinResultToDatabase(
                time,
                functionToreturnDummyResult(
                  Math.floor(Math.random() * (4 - 0 + 1)) + 0
                )
              );
            }
          })
          .catch((e) => {
            console.log("error in tron api");
            sendOneMinResultToDatabase(
              time,
              functionToreturnDummyResult(
                Math.floor(Math.random() * (4 - 0 + 1)) + 0
              )
            );
          });
      }, [4000]);
    }
  });
};

const sendOneMinResultToDatabase = async (time, obj) => {
  const newString = obj.hash;
  let num = null;
  for (let i = newString.length - 1; i >= 0; i--) {
    if (!isNaN(parseInt(newString[i]))) {
      num = parseInt(newString[i]);
      break;
    }
  }
  const query = `CALL sp_insert_trx_one_min_result_new(?, ?, ?, ?, ?, ?, ?)`;
  await queryDb(query, [
    num,
    String(moment(time).format("HH:mm:ss")),
    1,
    `**${obj.hash.slice(-4)}`,
    JSON.stringify(obj),
    `${obj.hash.slice(-5)}`,
    obj.number,
  ])
    .then((result) => {})
    .catch((e) => {
      console.log(e);
    });
};

//////// gateway///////////
// exports.generatedTimeEveryAfterEveryOneMinbyCrown = () => {
//   schedule.schedule("*/5 * * * *", function () {
//     INRWITHDRAWALCALLBACK();
//     console.log("function is called now");
//   });
// };
exports.INRWITHDRAWALCALLBACK = async () => {
  try {
    const get_all_pending_record =
      "SELECT * FROM `tr15_fund_request` WHERE `admin_approval` = 1 AND `tr15_status` = 1;";
    const data = await queryDb(get_all_pending_record, []);
    data.forEach(async (element) => {
      await CAllbackAPIunction(element);
    });
  } catch (e) {
    console.log(e);
  }
};

const CAllbackAPIunction = async (tableData) => {
  try {
    const fd = new FormData();
    fd.append("UserID", "7985913351");
    fd.append("Token", "32543253535796018096423746274583570018");
    fd.append("txttransid", tableData?.tr15_trans);

    const result = await axios.post(
      "https://indian.vpayout.com/Callback_payout/check_transaction_status_withdrwal",
      fd
    );
    if (result?.data?.status === "SUCCESS") {
      const save_data =
        "UPDATE `tr15_fund_request` SET admin_approval = 1,`tr15_status` = 2,success_date = NOW(),tr15_response = ?,callback_response = ? WHERE `tr15_id` = ? AND `tr15_trans` = ? AND `tr15_status` = 1;";
      await queryDb(save_data, [
        JSON.stringify(result?.data || ""),
        JSON.stringify(result?.data || ""),
        Number(tableData?.tr15_id),
        String(tableData?.tr15_trans),
      ]);
    } else if (result?.data?.status === "FAILED") {
      const save_data =
        "UPDATE `tr15_fund_request` SET admin_approval = 1,`tr15_status` = 3,success_date = NOW(),tr15_response = ?,callback_response=? WHERE `tr15_id` = ? AND `tr15_trans` = ? AND `tr15_status` = 1;";
      await queryDb(save_data, [
        JSON.stringify(result?.data || ""),
        JSON.stringify(result?.data || ""),
        Number(tableData?.tr15_id),
        String(tableData?.tr15_trans),
      ]);
      const callback_leser =
        "INSERT INTO leser(`l01_user_id`,`l01_type`,`l01_transection_type`,`l01_amount`) VALUES(?,?,?,?);";
      await queryDb(callback_leser, [
        Number(tableData?.userid),
        "Caseback",
        `Withdrawal Cashback get successfully. From TransId: ${tableData?.tr15_trans}`,
        tableData?.tr15_amt,
      ]);
      const callback_user =
        "UPDATE `user` SET `winning_wallet` = IFNULL(`winning_wallet`,0) + ? WHERE `id` = ?;";
      await queryDb(callback_user, [
        Number(tableData?.tr15_amt),
        Number(tableData?.userid),
      ]);
    } else {
      const save_data =
        "UPDATE `tr15_fund_request` SET admin_approval = 1,`tr15_status` = 1,tr15_response = ? WHERE `tr15_id` = ? AND `tr15_trans` = ? AND `tr15_status` = 1;";
      await queryDb(save_data, [
        JSON.stringify(result?.data || ""),
        Number(tableData?.tr15_id),
        String(tableData?.tr15_trans),
      ]);
    }
  } catch (e) {
    console.log(e);
  }
};
