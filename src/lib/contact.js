const COUNTRY_CODE = "+48";

export function telHref(phone) {
  return `tel:${COUNTRY_CODE}${phone.replace(/\D/g, "")}`;
}

export function smsHref(phone) {
  return telHref(phone).replace("tel:", "sms:");
}

export function mailHref(email) {
  return `mailto:${email}`;
}
