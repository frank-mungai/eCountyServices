package com.frajaytech.eCountyService.Entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "service_requests")
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

    public enum CompletionStatus {
        NOT_SUBMITTED,
        SUBMITTED,
        REJECTED,
        APPROVED
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

    @Column(nullable = false, length = 255)
    private String location;

    @Column(length = 100)
    private String administrativeSubCounty;

    @Column(length = 100)
    private String constituency;

    @Column(length = 100)
    private String ward;

    @Column(length = 150)
    private String village;

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

    // Department responsible for resolving this request.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    // Technician assigned to this request.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_technician_id")
    private User assignedTechnician;

    private Instant assignedAt;

    // Technician's completion submission.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CompletionStatus completionStatus =
            CompletionStatus.NOT_SUBMITTED;

    @Column(length = 2000)
    private String technicianCompletionNote;

    private String completionImagePath;

    private Instant completionSubmittedAt;

    // Administrator's verification decision.
    @Column(length = 1000)
    private String verificationNote;

    private Instant completionVerifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_admin_id")
    private User verifiedByAdmin;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    private Instant resolvedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();

        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (status == null) status = Status.PENDING;

        if (completionStatus == null) {
            completionStatus = CompletionStatus.NOT_SUBMITTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }

    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAdministrativeSubCounty() { return administrativeSubCounty; }
    public void setAdministrativeSubCounty(String value) { this.administrativeSubCounty = value; }

    public String getConstituency() { return constituency; }
    public void setConstituency(String constituency) { this.constituency = constituency; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public User getAssignedTechnician() { return assignedTechnician; }
    public void setAssignedTechnician(User technician) {
        this.assignedTechnician = technician;
    }

    public Instant getAssignedAt() { return assignedAt; }
    public void setAssignedAt(Instant assignedAt) { this.assignedAt = assignedAt; }

    public CompletionStatus getCompletionStatus() { return completionStatus; }
    public void setCompletionStatus(CompletionStatus value) {
        this.completionStatus = value;
    }

    public String getTechnicianCompletionNote() { return technicianCompletionNote; }
    public void setTechnicianCompletionNote(String value) {
        this.technicianCompletionNote = value;
    }

    public String getCompletionImagePath() { return completionImagePath; }
    public void setCompletionImagePath(String value) {
        this.completionImagePath = value;
    }

    public Instant getCompletionSubmittedAt() { return completionSubmittedAt; }
    public void setCompletionSubmittedAt(Instant value) {
        this.completionSubmittedAt = value;
    }

    public String getVerificationNote() { return verificationNote; }
    public void setVerificationNote(String value) {
        this.verificationNote = value;
    }

    public Instant getCompletionVerifiedAt() { return completionVerifiedAt; }
    public void setCompletionVerifiedAt(Instant value) {
        this.completionVerifiedAt = value;
    }

    public User getVerifiedByAdmin() { return verifiedByAdmin; }
    public void setVerifiedByAdmin(User value) {
        this.verifiedByAdmin = value;
    }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}