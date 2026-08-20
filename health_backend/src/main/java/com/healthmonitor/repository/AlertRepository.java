package com.healthmonitor.repository;

import com.healthmonitor.entity.AlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<AlertEntity, Long> {

    @Query("SELECT a FROM AlertEntity a WHERE (:deviceId IS NULL OR a.deviceId = :deviceId) ORDER BY a.timestamp DESC")
    List<AlertEntity> findRecentAlerts(@Param("deviceId") String deviceId);
}
