const mongoose = require('mongoose');
const Event = mongoose.model('event');
module.exports = (app) => {
    // The goal of this function is to getAllUnavailable blocks of time from a given start date to a given end date
    // The current iteration assumes that if a block of time is unavaialble it is unavailable every day

    // the next iteration will enable users to mark every Tuesday for example or specific dates as unavailable

    // @param assume unavailbleTimes comes in the format [{start, end, tag}] where the tag has already been selected
    // @start will be in local hours
    // @end will be in local hours as well
    function filterUnavailableTimes(start, end, unavailableTimes) {
        var result = [];
        var endDay = end.getDate();
        for (const i in unavailableTimes) {
            // get the given start and end of an unavailable interval
            const unavailableInterval = unavailableTimes[i];
            const startHour = unavailableInterval.start;
            const startMinutes = startHour % 1 * 60;
            const endHour = unavailableInterval.end;
            const endMinutes = endHour % 1 * 60;
            const dayOfWeek = unavailableInterval.day;
            // keep track of day we are currently on
            var currentDay = new Date(start.getTime());
       

            while (currentDay.getDate() <= endDay) {
                if (!dayOfWeek || dayOfWeek === currentDay.getDay()) {
                    var unStartDate = new Date(currentDay.getTime());
                    // get the start and end block of when we're not free
                    if(startMinutes >0) {
                        unStartDate.setHours(startHour, startMinutes);
                    } else {
                        unStartDate.setHours(startHour);
                    }
                    var unEndDate = new Date(currentDay.getTime());
                    if(endMinutes >0) {
                        unEndDate.setHours(endHour, endMinutes);
                    } else {
                        unEndDate.setHours(endHour);
                    }
                    
                    result.push([unStartDate, unEndDate]);
                    // // let s2 represent an unavailable block
                    // // case 1 s1 --- s2 -- e2 --- e1
                    // if (unStartDate >= start && unEndDate <= end) {

                    //     // case 2 s2 -- s1 -- e2 -- e1
                    // } else if (unStartDate <= start && end >= unEndDate) {

                    //     // case 3 s1 -- s2 -- e1 -- e2
                    // } else if (unStartDate >= start && unEndDate >= end) {

                    //     // case 4 s2 -- s1 -- s2 -- e2
                    //     // case 5 s2 -- e2 -- s1 -- e1
                    //     // case 6 s1 -- e1 -- s2 -- e2
                    // } else if (unStartDate <= start && unEndDate >= end) {

                    // }

                    // bump up one more day
                }
                currentDay.setDate(currentDay.getDate() + 1);
            }
        }
        return result;
    }

    // gets all unavailable times given an emailList
    function getUnavailableTimes(emailList) {
       return Availability.find({email: {$in: emailList}}, {dailyBusyTimes: 1});
            
    }

    // app.get('/api/test1', (req, res) => {
    //     var testData = [new Date(2020, 5, 11, 3), new Date(2020, 5, 12, 6)];
    //     var unavailableTimes = [{start: 4, end: 5, tag: "work"}, {start: 4.5, end: 6.5, tag: "work"}];
    //     const response = filterUnavailableTimes(testData[0], testData[1], unavailableTimes);
    //     res.send(response);
    // })

    // Given a bunch of arbitrary time intervals of varying ranges, return standardized time intervals of a given duration. Optionally cap the number returned
    // @param duration in hours
    // @param numSuggestions is integers
    function filterDuration(events, duration, numSuggestion) {
        // step 1 is to make sure the interval is longer than the intended blocks of time. 
        // Check interval is longer than 1 hour for example

        // step 2 is to take the start date, start date + interval and return a new interval that fits blokc of time

        // this is bugged
        var results = [];
        var iteration = 0;
        for (const i in events) {
            var event = events[i];
            var originalEnd = new Date(event[1]);
            var originalStart = new Date(event[0]);
            const diffTime = Math.abs(originalEnd - originalStart);

            //calculate raw difference in hours
            var diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            var endtime = originalEnd;
            var starttime = originalStart;
            // if the interval is too long i.e free for a 2 day period but only want one hour intervals
            // hcange this logicc to a while loop eventually

            while (diffHours > duration && iteration < numSuggestion) {
                iteration = iteration + 1;
                const start = new Date(starttime.getTime());
                var e2Time = starttime;
                // one hour
                e2Time = new Date(e2Time.setHours(e2Time.getHours() + duration));
                const newDate = new Date(e2Time.getTime());
                results.push([start, newDate]);

                starttime = e2Time;
                diffHours = endtime - starttime;

            }
        }
        return results;
    }
    // gets all available times for a user in the next week
    // ?range=week
    // body = {email: [listofemails]}
    app.get('/api/getAvailableTimes', async (req, res) => {
        console.log('called get available times');

        // in the future, we will have filters for buffer room
        var emailList = req.body.email //|| ['xukevinwork@gmail.com']
        var range = req.query.range //|| 'week';
        var numSuggestions = 3;
        var latestStartDate = new Date();
        // support not just a week in the future
        if (range === "week") {
            latestStartDate.setDate(latestStartDate.getDate() + 7);
        }
        var changes = 0;


        Event.find({ owner: { $in: emailList }, start: { $lt: latestStartDate }, end: { $gt: new Date() } }, function (err, response) {
            // in the line below, lets also add unavailable times to response
            // response will represent all events of time in which SOMEONE is busy
            // first we sort reponse by date
            response = response.sort(function (a, b) { if ((a.start - b.start) > 0) { return 1 } else { return -1 } })
            var availableTimes = [];
            // we will keep track of two pointers. the first pointer marks the start of the "zero conflict" period.
            // the second pointer keeps track of the end of this period. We add the "zero conflict" period to our results at the moment before a conflict is created.
            var s1 = new Date();
            var e2 = new Date();
            for (var i = 0; i < response.length; i++) {
                if (availableTimes.length < numSuggestions) {
                    var s2 = response[i].start;
                    var e2 = response[i].end;
                    // case 1) in which s1 --- e1 (leeway) s2 ---e2
                    if (s2 > e2) {
                        const s1Date = new Date(e2)
                        const e2Date = new Date(s2)
                        availableTimes.push([s1Date, e2Date]);
                        changes = changes + 1;
                        s1 = s2;
                        e2 = e2;
                    } else {
                        // case 2) where s1 --- s2 -- e1 -- e2
                        if (s2 > s1) {
                            e2 = e2;
                        }
                        // case where s1 -- s2 -- e2 -- e1
                        // case where s2 -- s1 -- e2 -- e1 (can't happen cause sorted)
                        // case where s2 -- s1 -- e1-- e2 (can't happen cause sorted)
                    }
                }
            }

            const s1Date = new Date(e2);
            const e2Date = new Date(latestStartDate);
            // add filtering
            availableTimes.push([s1Date, e2Date])
            availableTimes = filterDuration(availableTimes, 1, 3);
            res.send(availableTimes)
        })
    })
}