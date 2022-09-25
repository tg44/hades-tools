

export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
    }, {} as Record<K, T[]>);


//https://stackoverflow.com/a/8212878/2118749
export function secondsToStr (inSeconds: number) {
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding (number: number) {
        //return (number > 1) ? 's' : '';
        return ''
    }

    var temp = inSeconds;
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + 'y' + numberEnding(years);
    }
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + 'd' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + 'h' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + 'm' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + 's' + numberEnding(seconds);
    }
    return 'less than a second'; //'just now' //or other string you like;
}
