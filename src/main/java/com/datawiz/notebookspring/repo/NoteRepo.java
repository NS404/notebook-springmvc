package com.datawiz.notebookspring.repo;

import com.datawiz.notebookspring.model.Category;
import com.datawiz.notebookspring.model.Note;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NoteRepo extends CrudRepository<Note, Integer> {

    @Transactional
    @Modifying
    @Query("UPDATE Note n set n.title = :title, n.content = :content where n.id = :id")
    public void updateNote(@Param("title") String title, @Param("content") String content, @Param("id") int id);

    public Note getNoteById(int id);

    public List<Note> getNOtesByCategory(Category category);
}
