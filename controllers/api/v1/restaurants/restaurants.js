const Restaurant = require("../../../../fetch/restaurant");
const date = new Date();

const openToday = weekDays => {
  const date = new Date();
  const n = date.getDay() + 6;
  const todayHours = weekDays[n % 7];
  return !todayHours.includes("Closed");
};

const openTwentyFour = weekDays => {
  const date = new Date();
  const n = date.getDay() + 6;
  const todayHours = weekDays[n % 7];
  return todayHours.includes("Open 24 hours");
};

const getClosedDay = weekDays => {
  let closedDays = [];
  weekDays &&
    weekDays.forEach((day, i) => {
      if (day.includes("Closed")) closedDays.push((i + 1) % 7);
    });
  return closedDays;
};

const getTodayHours = (periods, weekDays = []) => {
  const date = new Date();
  const n = date.getDay();
  const closedDays = getClosedDay(weekDays);

  if (!openToday(weekDays)) return "Closed";
  if (openTwentyFour(weekDays)) return "Open 24 hours";

  return n > closedDays.length ? periods[n - closedDays.length] : periods[n];
};

const getNextDayHours = (todayHours, periods) => {
  const todayIndex = periods && periods.indexOf(todayHours);
  const nextDayHours = periods[(todayIndex + 1) % periods.length];
  return nextDayHours;
};

module.exports = {
  findAllRestaurants: async (req, res, next) => {
    const filters = req.body;
    try {
      const restaurants = await Restaurant.findNearby(filters);
      res.status(200).json(restaurants);
    } catch (error) {
      console.log(error);
    }
  },
  getNextRests: async (req, res, next) => {
    const { pageToken } = req.body;
    try {
      const nextRests = await Restaurant.getNext(pageToken);
      res.status(200).json(nextRests);
    } catch (error) {
      console.log(error);
    }
  },
  getRestaurantSchedule: async (req, res, next) => {
    try {
      const { placeId, filters } = req.body;
      const restaruantSchedule = await Restaurant.getPlaceSchedule(
        placeId,
        filters
      );

      const { name, opening_hours: openingHours } = restaruantSchedule.result;
      if (openingHours) {
        const {
          periods,
          weekday_text: weekDays,
          open_now: isOpenNow
        } = openingHours;
        const isOpenToday = openToday(weekDays);
        const todayHours = getTodayHours(periods, weekDays);
        const nextDayHours = getNextDayHours(todayHours, periods);

        if (todayHours === "Open 24 hours") {
          return res.status(200).json({
            immortal: "Open 24 hours"
          });
        }
        return res.status(200).json({
          name,
          isOpenToday,
          isOpenNow,
          todayHours,
          nextDayHours,
          weekDays
        });
      }
      return res.status(200).json({
        notAvailable: "The business hour for this restaurant is not available."
      });
    } catch (error) {
      console.log(error);
    }
  },
  getDetail: async (req, res, next) => {
    try {
      const { placeId, filters } = req.body;
      const { result } = await Restaurant.getPlaceSchedule(placeId, filters);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  },
  getBusyHours: async (req, res, next) => {
    const { placeId } = req.body;
    try {
      const nextRests = await Restaurant.getBusyHours(placeId);
      res.status(200).json(nextRests);
    } catch (error) {
      console.log(error);
    }
  }
};
