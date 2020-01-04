export default (ctx, inject) => {
  const utils = {
    round: (value, decimals) => {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }
  }
  inject('utils', utils)
}