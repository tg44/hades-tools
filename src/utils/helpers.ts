

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

export function sum(arr: number[]): number {
    return arr.reduce<number>((accumulator, current) => {
        return accumulator + current;
    }, 0);
}

export function sumBy<A>(arr: A[], fn: (e: A) => number): number {
    return sum(arr.map(fn))
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export function minBy<A>(arr: A[], fn: (e: A) => number | unknown | null) {
    return extremumBy(arr, fn, Math.min);
}

export function maxBy<A>(arr: A[], fn: (e: A) => number | unknown | null) {
    return extremumBy(arr, fn, Math.max);
}

type Pair<A, B> = [B , A]
type PairWithUnknown<A, B> = [B | unknown | null, A]

export function extremumBy<A, B>(arr: A[], pluck: (e: A) => B | unknown | null, extremum: (e1: B, e2: B) => B): A | undefined {
    return arr.reduce((best: Pair<A, B> | null, next: A) => {
        const pair: PairWithUnknown<A, B> = [ pluck(next), next ];
        if(!notEmpty(pair[0])){
            return best
        }
        const knownPair = pair as Pair<A,B>
        if (!best) {
            return knownPair;
        } else if (extremum.apply(null, [ best[0], knownPair[0] ]) == best[0]) {
            return best;
        } else {
            return knownPair;
        }
    },null)?.[1];
}