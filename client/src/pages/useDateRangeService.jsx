import { useState } from 'react';
import * as datefns from 'date-fns';

export const useDateRangeService = () => {
  const [dateMarker, setDateMarker] = useState(new Date());
  // get monday and friday of this week using date-fns
  const [monday, friday] = [datefns.startOfWeek(dateMarker), datefns.endOfWeek(dateMarker)];
  const nextWeek = () => {
    setDateMarker(datefns.addWeeks(dateMarker, 1));
  };

  const prevWeek = () => {
    setDateMarker(datefns.addWeeks(dateMarker, -1));
  };

  const setTodayAsTarget = () => setDateMarker(new Date());
  const [startOfMonth, endOfMonth] = [
    datefns.startOfMonth(dateMarker),
    datefns.endOfMonth(dateMarker),
  ];
  const nextMonth = () => setDateMarker(datefns.addMonths(dateMarker, 1));
  const prevMonth = () => setDateMarker(datefns.addMonths(dateMarker, -1));

  return {
    dateMarker,
    monday,
    friday,
    nextWeek,
    prevWeek,
    setTodayAsTarget,
    setDateMarker,
    startOfMonth,
    endOfMonth,
    nextMonth,
    prevMonth,
  };
};
