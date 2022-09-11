const getBoard = async (city,stop) => {
	const json = await fetch(`https://waka.app/a/nz-${city}/station/${stop}/times/`).then(resp => resp.json());
	return json.trips
		.sort((x,y) => x.departure_time < y.departure_time)
		.map(trip => ({
			shortName: trip.route_short_name,
			scheduledTime: trip.departure_time.match(/T(\d{2}:\d{2})/)[1],
			realtime: Math.ceil(-(json.currentTime - (trip.departure_time_seconds + json.realtime[trip.trip_id]?.delay)) / 60)
		}))
		.filter(({ realtime }) => !(realtime < 0))
		.slice(0, 10)
		.reduce((acc, { shortName, scheduledTime, realtime }) => [...acc, [shortName, scheduledTime, isNaN(realtime) ? "" : realtime < 2 ? "*" : realtime].join(" ")], [])
		.join("\n");
};

if (window) window.getBoard = getBoard;
