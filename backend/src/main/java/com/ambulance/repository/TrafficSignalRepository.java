package com.ambulance.repository;

import com.ambulance.entity.TrafficSignal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrafficSignalRepository extends JpaRepository<TrafficSignal, Long> {
}
