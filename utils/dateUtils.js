Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
}

/**
 * yyyy/MM/dd
 * 
 * @param {*} time 
 * @returns 
 */
exports.getDateWithTime = function (time) {
    const t = new Date(time);
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    return `${year}/${month}/${date}`;
}


/**
 * 
 * @param {*} time 
 * @param {*} hour 
 * @param {*} minute 
 * @returns 
 */
exports.getMergeDate = function (time, hour, minute) {
    const t = new Date(time);
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    return new Date(`${year}/${month}/${date} ${hour}:${minute}`);
}

/**
 * return yyyy-MM-dd HH:mm:00
 * 
 * @param {*} time 
 * @returns 
 */
exports.getTimeStr = function (time) {
    const t = new Date(time);
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    return `${year}-${month}-${date} ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')}`;
}



/**
 * 依據日期取得星期
 * 
 * @param {*} date 
 * @returns 
 */
exports.getWeekNameByDate = function (date) {
    const day = date.getDay();
    //"Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
    switch (day) {
        case 0: return "SUNDAY";
        case 1: return "MONDAY";
        case 2: return "TUESDAY";
        case 3: return "WENDNESDAY";
        case 4: return "THURSDAY";
        case 5: return "FRIDAY";
        case 6: return "SATURDAY";
        default: return "";
    }
}


/**
 * 取得日期陣列
 * 
 * @param {*} date 
 * @returns 
 */
exports.getWeekIndexByWeekArray = function (weekArray) {
    const weeks = [];
    weekArray.forEach(each => {
        switch (each) {
            case "SUNDAY": weeks.push(0); break;
            case "MONDAY": weeks.push(1); break;
            case "TUESDAY": weeks.push(2); break;
            case "WENDNESDAY": weeks.push(3); break;
            case "THURSDAY": weeks.push(4); break;
            case "FRIDAY": weeks.push(5); break;
            case "SATURDAY": weeks.push(6); break;
        }
    })
    return weeks.sort()
}

/**
 * 取得日期陣列
 * 
 * @param {*} date 
 * @returns 
 */
exports.getWeekIndexByWeeNamek = function (weekName) {

    switch (weekName) {
        case "SUNDAY": return 0;
        case "MONDAY": return 1;
        case "TUESDAY": return 2;
        case "WENDNESDAY": return 3;
        case "THURSDAY": return 4;
        case "FRIDAY": return 5;
        case "SATURDAY": return 6;
        default: return;
    }

}

/**
 * 取得整點時間，如果時間不到30分則顯示xx:30 超過30分則顯示00:00
 * 
 * @param {*} time 
 */
exports.getOClock = function (time) {
    const isHalf = time.getMinutes() >= 30;
    let nowHours = time.getHours();
    let nowMinutes = 0;
    if (isHalf) {
        nowHours++;
    } else {
        nowMinutes = 30;
    }
    return new Date(new Date(time.setHours(nowHours)).setMinutes(nowMinutes))

}

exports.checkCrossDay = function (start_time, end_time) {
    const st = new Date(start_time);
    const et = new Date(end_time);
    const start = Number(String(st.getHours()) + String(st.getMinutes()));
    const end = Number(String(et.getHours()) + String(et.getMinutes()));
    return start >= end;
}
