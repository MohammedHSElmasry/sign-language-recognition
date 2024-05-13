import schedule from "node-schedule";

 export const checkDataBase = () => {
  schedule.scheduleJob("*/2 * * * * *", function () {
    // console.log("checkDataBase");
  });
};



export const sendemail = () => {
    schedule.scheduleJob("*/2 * * * * *", function () {
      // console.log("sendemail");
    });
  };
  

