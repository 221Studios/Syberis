const COUNTRY_CODE = "+48";

export function telHref(phone) {
  return `tel:${COUNTRY_CODE}${phone.replace(/\D/g, "")}`;
}

export function mailHref(email) {
  return `mailto:${email}`;
}
