import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';
import { trpc } from 'src/hooks/trpc';
import { useState } from 'react';
import { useDateRangeService } from 'src/pages/useDateRangeService';
import * as datefns from 'date-fns';
import { Button, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function AppView() {
  const [groupByFields, setGroupByFields] = useState(['reason']);
  const { startOfMonth, endOfMonth, nextMonth, prevMonth, dateMarker, setTodayAsTarget } =
    useDateRangeService();

  //compute the days in the month
  const datesInMonthList = Array(datefns.differenceInDays(endOfMonth, startOfMonth, 'days'))
    .fill(null)
    .map((_, index) => datefns.addDays(startOfMonth, index));
  const appoitnmentStatesQuery = trpc.appointments.appointmentStats.useQuery(
    {
      dates: datesInMonthList,
      groupByFields,
    },
    { enabled: Boolean(groupByFields?.length && datesInMonthList?.length) }
  );

  const appointmentLabels = appoitnmentStatesQuery?.data?.map((item) => item.reason) ?? [];
  const appointmentFrequencies =
    appoitnmentStatesQuery?.data?.map((item) => Number(item.frequency)) ?? [];

  const appointmentsPieData = appoitnmentStatesQuery?.data?.map((item) => ({
    label: item.reason,
    value: Number(item.frequency),
  }));

  if (appoitnmentStatesQuery.isLoading) {
    return <div>... is loading</div>;
  }

  console.log({ appointmentFrequencies, appointmentLabels, appointmentsPieData });
  return (
    <Container maxWidth="xl">
      <Stack direction="row" spacing={2}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back 👋
        </Typography>

        <Button onClick={() => prevMonth()}>prev month</Button>
        <Button onClick={() => nextMonth()}>next month</Button>
        <Button onClick={() => setTodayAsTarget()}>this month</Button>
        <span>Month: {datefns.format(dateMarker, 'MMMM yyyy')}</span>
      </Stack>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Reasons"
            total={appointmentFrequencies.length}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Frequencies sum"
            total={appointmentFrequencies.reduce((a, b) => a + b, 0)}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Reasons"
            subheader={datefns.format(dateMarker, 'MMMM yyyy')}
            chart={{
              labels: appointmentLabels,
              series: [
                {
                  name: 'Reasons',
                  type: 'column',
                  fill: 'solid',
                  // data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                  data: appointmentFrequencies,
                },
                // {
                //   name: 'Team B',
                //   type: 'area',
                //   fill: 'gradient',
                //   data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                // },
                // {
                //   name: 'Team C',
                //   type: 'line',
                //   fill: 'solid',
                //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                // },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                // { label: 'America', value: 4344 },
                // { label: 'Asia', value: 5435 },
                // { label: 'Europe', value: 1443 },
                // { label: 'Africa', value: 4443 },
                ...appointmentsPieData,
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
