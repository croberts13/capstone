import { Helmet } from 'react-helmet-async';
import { trpc } from 'src/hooks/trpc';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Appointments() {
  //get appointments  with trpc
  const appointments = trpc.appointments.getAppointments.useQuery();

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <table>
        <thead>
          <tr>
            <th>no</th>
            <th>title</th>
            <th>date</th>
            <th>reason</th>
            <th>doctor</th>
            <th>patient</th>
          </tr>
        </thead>
        <tbody>
          {/* show the appointments list */}

          {appointments?.data?.map((appointment, index) => (
            <tr key={appointment.id}>
              <td>{index + 1}</td>
              <td>{appointment.title}</td>
              <td>{appointment.date}</td>
              <td>{appointment.reason}</td>
              <td>{appointment.doctor}</td>
              <td>{appointment.patient}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
