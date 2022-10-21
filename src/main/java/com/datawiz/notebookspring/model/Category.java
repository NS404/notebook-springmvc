package com.datawiz.notebookspring.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@NoArgsConstructor
@Getter
@Setter
@Table(name = "categories")
@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private int id;

    @Column(name = "category_name")
    private String name;

    @OneToMany(fetch = FetchType.EAGER ,mappedBy = "category", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Note> notes;

    public Category(String categoryName){
        this.name = categoryName;
        this.notes = new ArrayList<>();
    }


}