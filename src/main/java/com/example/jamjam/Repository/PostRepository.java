package com.example.jamjam.Repository;

import com.example.jamjam.Entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;



public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByBoard(String board, Pageable pageable);
}
