package com.datawiz.notebookspring.repo;

import com.datawiz.notebookspring.model.Note;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface NoteRepo extends CrudRepository<Note, Integer> {

    @Modifying
    @Query("UPDATE Note n set n.title = :title, n.title = :content where n.id = :id")
    public void updateNote(@Param("title") String title, @Param("content") String content, @Param("id") int id);
}
