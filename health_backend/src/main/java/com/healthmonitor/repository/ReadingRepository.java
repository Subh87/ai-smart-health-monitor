package com.healthmonitor.repository;

import com.healthmonitor.entity.ReadingEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingRepository extends JpaRepository<ReadingEntity, Long> {

    Optional<ReadingEntity> findFirstByDeviceIdOrderByTimestampDesc(String deviceId);

    Optional<ReadingEntity> findFirstByOrderByTimestampDesc();

    @Query("SELECT r FROM ReadingEntity r WHERE (:deviceId IS NULL OR r.deviceId = :deviceId) AND r.timestamp >= :since ORDER BY r.timestamp DESC")
    List<ReadingEntity> findHistory(@Param("deviceId") String deviceId, @Param("since") LocalDateTime since, Pageable pageable);
}
