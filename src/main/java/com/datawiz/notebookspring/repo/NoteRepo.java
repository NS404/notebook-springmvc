package com.datawiz.notebookspring.repo;

import com.datawiz.notebookspring.model.Note;
import org.springframework.data.repository.CrudRepository;

public interface NoteRepo extends CrudRepository<Note, Integer> {
}
