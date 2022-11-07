package com.datawiz.notebookspring.repo;

import com.datawiz.notebookspring.model.Category;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface CategoryRepo extends CrudRepository<Category,Integer> {

    @Transactional
    @Modifying
    @Query("update Category c set c.name = :name where c.id = :id")
    void updateCategory(@Param("id") int id, @Param("name") String name);
}
