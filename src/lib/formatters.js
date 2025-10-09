import dayjs from "dayjs"

export const formatDate = (date, format = "DD/MM/YYYY") => {
  if (!date) return ""
  return dayjs(date).format(format)
}

export const formatDateTime = (date) => {
  if (!date) return ""
  return dayjs(date).format("DD/MM/YYYY HH:mm")
}

export const formatQty = (qty, decimals = 2) => {
  if (qty === null || qty === undefined) return ""
  return Number(qty).toFixed(decimals)
}

export const formatMoney = (amount, decimals = 2) => {
  if (amount === null || amount === undefined) return ""
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

export const formatCurrency = formatMoney

export const formatGsm = (gsm) => {
  if (!gsm) return ""
  return `${gsm} GSM`
}

export const formatWidth = (width) => {
  if (!width) return ""
  return `${width}"`
}

export const formatWeight = (weight, unit = "Kgs") => {
  if (weight === null || weight === undefined) return ""
  return `${formatQty(weight)} ${unit}`
}
