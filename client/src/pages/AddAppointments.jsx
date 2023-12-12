import { useState } from 'react';
import * as datefns from 'date-fns';
import { Helmet } from 'react-helmet-async';

import {
  Stack,
  Table,
  Button,
  Dialog,
  Select,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  Autocomplete,
  Box,
} from '@mui/material';

import { trpc } from 'src/hooks/trpc';
import { useAuth } from 'src/store/slices/authSlice';
import { Icon } from '@iconify/react';
import { useDateRangeService } from './useDateRangeService';

// ----------------------------------------------------------------------
/**
 *
 * @typedef {Record<date,AppointmentSlot>} WeekSlots
 */
// ----------------------------------------------------------------------
export const AddAppointments = () => {
  // get the open appointments with trpc
  const auth = useAuth();
  const { monday, nextWeek, prevWeek, setTodayAsTarget, nextMonth, prevMonth } =
    useDateRangeService();
  const [slotDialogData, setSlotDialogData] = useState(/** @type {{hour,date,slot}|null} */ (null));
  const updateAppointmentMutation = trpc.appointments.updateAppointment.useMutation();
  const createAppointmentMutation = trpc.appointments.createAppointment.useMutation();
  const deleteAppointmentMutation = trpc.appointments.deleteAppointment.useMutation();

  const doctors = trpc.user.getDoctors
    .useQuery()
    ?.data // if the authed user is a doctor then use only his doctor record for doctors list else use all doctors
    ?.filter((d) => (auth.user.Role.title === 'doctor' ? d.id === auth.user.id : true));
  const patients = trpc.user.getPatients
    .useQuery()
    ?.data // if the logged in user is a patient, only use that matching patient for the patient list  else use all patients
    ?.filter((d) => (auth.user.Role.title === 'patient' ? d.id === auth.user.id : true));

  const hours = Array(8)
    .fill(0)
    .map(
      (_, index) =>
        // get the start and end of the hour
        index + 9
    );

  const datesThisWeekArr = Array(7)
    .fill(0)
    .map((_, index) => {
      const date = datefns.format(datefns.addDays(monday, index), 'yyyy-MM-dd');

      return date;
    });
  const openSlots = trpc.appointments.getOpenHourSlots.useQuery(datesThisWeekArr);

  // cross days of weeks with hours
  /**
   * @type {Record<date,[hour,slot][]>}
   */

  const loadSlotDetails = (/** @type {typeof slotDialogData} */ slotDialogDataInput) => {
    // get the open slots for this date
    setSlotDialogData(slotDialogDataInput);
  };

  const doCloseSlotDetailsDialog = () => setSlotDialogData(null);

  const doSubmitAppointmentUpsert = (e) => {
    e.preventDefault();
    const tempSlotDialogData = {
      hour_slot: parseInt(e.target.hour.value, 10),
      date: e.target.date.value,
      doctor_id: doctors.find((d) => d.username === e.target.doctor_username.value).id,
      patient_id: patients.find((d) => d.username === e.target.patient_username.value).id,
      title: e.target.title.value,
      reason: e.target.reason.value,
      ...(slotDialogData?.slot?.id ? { id: slotDialogData?.slot?.id } : {}),
    };

    const updateOrCreate = slotDialogData?.slot?.id
      ? updateAppointmentMutation
      : createAppointmentMutation;

    updateOrCreate
      .mutateAsync(tempSlotDialogData)
      .then(() => {
        doCloseSlotDetailsDialog();
        openSlots.refetch();
      })
      .catch(console.error);
  };

  const doSlotDialogFormchanged = (e) => {
    // setTempSlotDialogData({...slotDialogData, [e.target.name]: e.target.value });
    console.log('slotDialogData', e.target.name, e.target.value);
  };

  return (
    <>
      <Helmet>
        <title> Appointments </title>
      </Helmet>

      {/* const show calendar */}
      <Stack direction="column">
        <Stack direction="row" className="calendar-nav-actions" spacing={2}>
          <Button variant="outlined" onClick={() => prevMonth()}>
            Prev Month
          </Button>
          <Button variant="outlined" onClick={() => nextMonth()}>
            Next month
          </Button>
          <Button variant="outlined" onClick={() => prevWeek()}>
            Prev week
          </Button>
          <span> </span>
          <Button variant="outlined" onClick={() => nextWeek()}>
            Next week
          </Button>

          <Button variant="outlined" onClick={() => setTodayAsTarget()}>
            Today
          </Button>
        </Stack>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Date</TableCell>
              {hours.map((hour, index) => (
                <TableCell key={index}>{hour}:00</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {datesThisWeekArr.map((date) => (
              <TableRow key={date}>
                <TableCell>{datefns.format(new Date(date), 'EEEE')}</TableCell>
                <TableCell>
                  {datefns.isSameDay(date, new Date()) && <Icon icon="mdi-calendar" />}
                  <span>{datefns.format(new Date(date), 'dd MMMM yyyy')}</span>
                </TableCell>
                {hours.map((hour) => {
                  const slots = openSlots.data?.filter(
                    (_slot) => _slot.date === date && _slot.hour_slot === hour
                  );
                  return (
                    <TableCell key={hour}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          loadSlotDetails({ slot: slots?.length ? slots[0] : null, hour, date })
                        }
                      >
                        <Stack
                          direction="column"
                          sx={{
                            textAlign: 'start',
                            width: '10ch',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {slots?.length && slots[0]?.patient_id ? (
                            <>
                              <span>{slots?.at(0)?.title}</span>
                              <span> {slots?.length && slots[0]?.patient?.username}</span>
                              <span> {slots?.length && slots[0]?.doctor?.username}</span>
                              <span>Counts: {slots?.length}</span>
                            </>
                          ) : (
                            <span>open</span>
                          )}
                        </Stack>
                      </Button>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>

      {slotDialogData && (
        <Dialog open={slotDialogData} onClose={doCloseSlotDetailsDialog}>
          <DialogTitle>Appointment Details</DialogTitle>
          {/* make form fields for date, hour, reason, doctor[select], patient[select] */}
          <form onSubmit={doSubmitAppointmentUpsert} onChange={doSlotDialogFormchanged}>
            <DialogContent>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 2 }}>
                <TextField
                  name="date"
                  type="date"
                  label="Date"
                  defaultValue={slotDialogData.date}
                  readonly
                  disabled
                  sx={{ width: '48%' }}
                />
                <TextField
                  name="hour"
                  type="number"
                  label="Hour"
                  min={8}
                  max={14}
                  defaultValue={slotDialogData.hour}
                  sx={{ width: '48%' }}
                  required
                />

                <FormControl sx={{ width: '100%' }}>
                  <Autocomplete
                    options={doctors}
                    defaultValue={
                      slotDialogData?.slot?.doctor ??
                      (auth.user.Role.title === 'doctor' && auth.user)
                    }
                    renderOption={(props, doctor) => (
                      <MenuItem {...props} value={doctor}>
                        {doctor.username}
                      </MenuItem>
                    )}
                    getOptionLabel={(option) => option.username}
                    required
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select doctor"
                        name="doctor_username"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'email', // disable autocomplete and autofill
                        }}
                      />
                    )}
                    disabled={auth.user.Role.title === 'doctor'}
                  />
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                  <Autocomplete
                    options={patients}
                    required
                    defaultValue={
                      slotDialogData?.slot?.patient ??
                      (auth.user.Role.title === 'patient' && auth.user)
                    }
                    renderOption={(props, patient) => (
                      <MenuItem {...props} value={patient}>
                        {patient.username}
                      </MenuItem>
                    )}
                    getOptionLabel={(option) => option.username}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="patient_username"
                        label="Select patient"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'email', // disable autocomplete and autofill
                        }}
                      />
                    )}
                    disabled={auth.user.Role.title === 'patient'}
                  />
                </FormControl>

                <TextField
                  name="title"
                  label="Title"
                  required
                  defaultValue={slotDialogData.slot?.title}
                  sx={{ width: '100%' }}
                  multiline
                />

                <TextField
                  name="reason"
                  label="Reason"
                  defaultValue={slotDialogData.slot?.reason}
                  sx={{ width: '100%' }}
                  multiline
                  rows={4}
                />
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button
                disabled={!slotDialogData.slot?.patient_id}
                onClick={() => {
                  deleteAppointmentMutation.mutateAsync(slotDialogData.slot.id).then(() => {
                    openSlots.refetch();
                    doCloseSlotDetailsDialog();
                  });
                }}
              >
                Delete
              </Button>
              <Button type="submit" variant="outlined">
                {slotDialogData.slot?.id ? 'Update' : 'Save'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </>
  );
};
