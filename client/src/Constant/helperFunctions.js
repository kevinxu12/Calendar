export var getCalendarDataFromResponse = function (response) {
    return response.data.map((entry) => {
        var startdate = new Date(entry.start);
        var enddate = new Date(entry.end);
        var start = startdate.getHours() + startdate.getMinutes() / 60;
        var end = enddate.getHours() + enddate.getMinutes() / 60;
        return {
            startTime: start,
            endTime: end,
            title: entry.summary || 'no summary',
            ...entry
        }
        // return {
        //     title: entry.summary || 'no summary',
        //     startTime: start,
        //     endTime: end,
        //     description: entry.description,
        //     creator: entry.creator,
        //     owner: entry.owner,
        //     _id: entry._id,
        //     permissions: entry.permissions,
        //     id: entry.id
        // }
    })
}

export var generateLinkURL = function(data) { 
    var service = 'google';
    var title = data.title;
    console.log(data);
    var start = data.start.toISOString().replace('T', ' ').substr(0, 16)
    var end = data.end.toISOString().replace('T', ' ').substr(0, 16)
    start = encodeURIComponent(start);
    end = encodeURIComponent(end);
    title = encodeURIComponent(title); 
    return `https://calndr.link/d/event?service=${service}&title=${title}&start=${start}&end=${end}`
}