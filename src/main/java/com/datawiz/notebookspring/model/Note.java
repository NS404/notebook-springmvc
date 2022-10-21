package com.datawiz.notebookspring.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "note_id")
    private int id;
    @Column(name = "note_title", nullable = false)
    private String title;

    @Column(name = "note_content")
    private String content;

    //Relation
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;


    public Note(String noteTitle, String noteContent, Category selectedCategory) {
        this.title = noteTitle;
        this.content = noteContent;
        this.category = selectedCategory;
    }
}