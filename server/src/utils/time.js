
export default class Time {

  static getCurrentTimestamp () {
    return Math.floor(Date.now() / 1000)
  }

  static getCurrentISO () {
    const now = new Date();
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    return utc.toISOString();
  }

  static getTimestampByMinute (startTime, minute) {
    const second = parseFloat(minute) * 60

    return startTime + second
  }

  static delay (timeout = 300) {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }
}
