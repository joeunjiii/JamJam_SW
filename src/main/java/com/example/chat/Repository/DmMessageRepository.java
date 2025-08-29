package com.example.chat.Repository; // 프로젝트에 맞춰 유지 (가능하면 repository 로 소문자 권장)

import com.example.chat.domain.DmMessage; // ✅ 소문자 domain import
import com.example.chat.domain.DmThread;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DmMessageRepository extends JpaRepository<DmMessage, Long> {

    // ✅ 파생 쿼리는 "엔티티 필드명" 기준으로 파싱됨 (thread, id)
    List<DmMessage> findByThreadOrderByIdDesc(DmThread thread, Pageable pageable);

    // (선택) 무한 스크롤용
    List<DmMessage> findByThreadAndIdLessThanOrderByIdDesc(DmThread thread, Long lastId, Pageable pageable);
}
