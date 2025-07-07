import { EXTERNAL_URLS } from "@/src/constants/urls";

const whatsappMessage = `Hi Refuel Team,\n\n I saw your add on Buy Sell Cars (https://buysellcars.co.zw) and would like to know more about your services!`;
export const REFUEL_WHATSAPP_URL = `${EXTERNAL_URLS.REFUEL_WHATSAPP_URL}?text=${encodeURIComponent(whatsappMessage)}`;
