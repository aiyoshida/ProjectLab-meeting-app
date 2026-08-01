//Library for date, time operation
//指定されたタイムゾーンに基づいて「今日の9時〜21時までの1時間刻みの時刻（スロット）」の一覧を作成する関数
import {DateTime} from "luxon";

export default function getBaseTime(timezone, slotDuration = "01:00:00") {
     const baseDate = DateTime.now().setZone(timezone).startOf("day");
     const slots = [];
     const [hours, minutes, seconds] = slotDuration.split(":").map(Number);
     const durationMinutes = (hours * 60) + minutes + (seconds / 60);

     for (let minute = 9 * 60; minute < 22 * 60; minute += durationMinutes){
          const slot = baseDate.plus({ minutes: minute });
          slots.push(slot);
     }
     console.log("getBaseTime.js : ", slots);
     return slots;
};
