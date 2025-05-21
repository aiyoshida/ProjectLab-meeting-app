//Library for date, time operation
import {DateTime} from "luxon";


const storedId = localStorage.getItem('userId');
const userId = storedId ? parseInt(storedId) : null;

export default function getBaseTime(timezone) {

     //Luxonを使った
     const baseDate = DateTime.now().setZone(timezone).startOf("day");
     const slots = [];

     for (let hour = 9; hour < 22; hour++){
          const slot=baseDate.set({hour, minute:0});
          slots.push(slot);
     }
     console.log(slots);
     return slots;
};
