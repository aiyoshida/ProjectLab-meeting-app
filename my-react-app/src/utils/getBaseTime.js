//Library for date, time operation
import {DateTime} from "luxon";

export default function getBaseTime() {
     //Luxonを使った
     const baseDate = DateTime.local().startOf("day");
     const slots = [];

     for (let hour = 9; hour < 22; hour++){
          const slot=baseDate.set({hour, minute:0});
          slots.push(slot);
     }
     return slots;
};
