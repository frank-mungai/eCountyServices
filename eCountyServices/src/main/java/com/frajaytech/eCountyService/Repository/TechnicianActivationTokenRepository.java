package com.frajaytech.eCountyService.Repository;

import com.frajaytech.eCountyService.Entity.TechnicianActivationToken;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TechnicianActivationTokenRepository
        extends JpaRepository<TechnicianActivationToken, Long> {

    /**
     * Find and lock a token while an activation transaction is running.
     * This helps prevent concurrent requests from consuming the same token.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT t
        FROM TechnicianActivationToken t
        WHERE t.tokenHash = :tokenHash
        """)
    Optional<TechnicianActivationToken> findByTokenHash(
            @Param("tokenHash") String tokenHash);

    /**
     * Delete previous unused tokens before issuing a replacement.
     * Tokens already used are retained for audit purposes.
     */
    @Modifying
    @Query("""
        DELETE FROM TechnicianActivationToken t
        WHERE t.user.id = :userId
          AND t.usedAt IS NULL
        """)
    int deleteUnusedTokensForUser(@Param("userId") Long userId);
}
