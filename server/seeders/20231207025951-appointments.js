const db = require('../models');
const datefns = require('date-fns');

const mockReasons = [
    'allergies',
    'disabilities',
    'other',
    'cold',
    'illness',
    'pain',
    'stress',
    'diabetes',
    'hypertension',
    'blood pressure'
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */

        const doctorRoleId = await db.Role.findOne({
            where: { title: 'doctor' }
        }).then((res) => res.id);

        const patientRoleId = await db.Role.findOne({
            where: { title: 'patient' }
        }).then((res) => res.id);

        const doctors = await db.User.findAll({
            where: {
                role_id: doctorRoleId
            },
            limit: 5,
            order: [['id', 'ASC']]
        });
        const patients = await db.User.findAll({
            where: {
                role_id: patientRoleId
            }
        });

        const firstMonday = datefns.startOfWeek(new Date(), {
            weekStartsOn: 2
        });

        const availableAppointments = Array(patients.length * doctors.length)
            .fill(null)
            .map((_, index, arr) => {
                // every 8 hours starts a new day
                const hour_slot = 8 + (index % 8);
                const dayCount = Math.floor(index / 8);
                const weekAsDays = 7 * Math.floor(dayCount / 5);
                const date = datefns.format(
                    datefns.addDays(firstMonday, (dayCount % 5) + weekAsDays),
                    'yyyy-MM-dd'
                );
                const patient_index = Math.floor(index % patients.length);
                const doctor_index = Math.floor(index % doctors.length);
                const reason =
                    mockReasons[Math.floor(Math.random() * mockReasons.length)];
                return {
                    patient_id: patients[patient_index].id,
                    doctor_id: doctors[doctor_index].id,
                    title: reason,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    reason,
                    hour_slot,
                    date: date
                };
            });

        // const appoitnments = patients
        //     .flatMap((patient) =>
        //         doctors.map((doctor) => ({
        //             patient_id: patient.id,
        //             title:
        //                 'test appointment' +
        //                 `${patient.email} - ${doctor.email}`,
        //             doctor_id: doctor.id,
        //             createdAt: new Date(),
        //             updatedAt: new Date(),
        //             reason: mockReasons[
        //                 Math.floor(Math.random() * mockReasons.length)
        //             ],
        //             date: null
        //         }))
        //     )
        //     .flatMap((apt) => [12].map((hour_slot) => ({ ...apt, hour_slot })));

        console.log(JSON.stringify(availableAppointments, null, 2));
        await queryInterface.bulkInsert('Appointments', availableAppointments);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

        await queryInterface.bulkDelete('Appointments', null, {});
    }
};
