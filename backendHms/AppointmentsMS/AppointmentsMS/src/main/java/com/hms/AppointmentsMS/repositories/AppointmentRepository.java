package com.hms.AppointmentsMS.repositories;

import org.springframework.data.repository.CrudRepository;

import com.hms.AppointmentsMS.entity.Appointment;

public interface AppointmentRepository extends CrudRepository<Appointment, Long> {

}
