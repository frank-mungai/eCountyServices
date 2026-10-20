 package com.frajaytech.eCountyService.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "service_requests")
@Getter
@Setter
public class ServiceRequest {

    public enum Category {
        STREETLIGHT,
        WATER_ISSUE,
        GARBAGE_COLLECTION,
        ROAD_DAMAGE,
        SEWAGE,
        OTHER
    }

    public enum Status {
        PENDING,
        IN_PROGRESS,
        RESOLVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false, length = 2000)
    private String description;

    private String imagePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(length = 1000)
    private String adminNote;

    private Double latitude;

    private Double longitude;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    private Instant resolvedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
