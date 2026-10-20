package com.frajaytech.eCountyService.Repository;

import com.frajaytech.eCountyService.Entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    List<ServiceRequest> findAllByOrderByCreatedAtDesc();

    List<ServiceRequest> findByStatusOrderByCreatedAtDesc(ServiceRequest.Status status);

    long countByStatus(ServiceRequest.Status status);

    @Query("select r.category, count(r) from ServiceRequest r group by r.category")
    List<Object[]> countByCategory();
}
