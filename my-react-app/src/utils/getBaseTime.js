//Library for date, time operation
//指定されたタイムゾーンに基づいて「今日の9時〜21時までの1時間刻みの時刻（スロット）」の一覧を作成する関数
import {DateTime} from "luxon";

export default function getBaseTime(timezone) {
     const baseDate = DateTime.now().setZone(timezone).startOf("day");
     const slots = [];

     for (let hour = 9; hour < 22; hour++){
          const slot=baseDate.set({hour, minute:0});
          slots.push(slot);
     }
     console.log("getBaseTime.js : ", slots);
     return slots;
};
