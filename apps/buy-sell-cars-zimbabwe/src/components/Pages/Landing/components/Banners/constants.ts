import { SPONSOR_URL } from "@/src/constants/sponsors";

const whatsappMessage = `Hi Refuel Team,\n\n I saw your add on Buy Sell Cars (https://buysellcars.co.zw) and would like to know more about your services!`;
export const REFUEL_WHATSAPP_URL = `${SPONSOR_URL.REFUEL_WHATSAPP_URL}?text=${encodeURIComponent(whatsappMessage)}`;
