import { API_BASE_URL } from "@/lib/constants";
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";

interface Lesson {
  id: number;
  title: string;
  content: string;
  image?: string;
}

export default function CMSDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({ title: "", content: "" });

  useEffect(() => {
    fetchLessons(); // Call without a parameter for initial fetch
  }, []);
  
  const fetchLessons = async (lessonId?: number) => {
    try {
      const url = lessonId 
        ? `${API_BASE_URL}/api/list-contents?lesson_id=${lessonId}` 
        : `${API_BASE_URL}/api/list-contents`;
  
      const response = await fetch(url);
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };
  

  const handleAddLesson = async () => {
    await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLesson),
    });
    setShowAddModal(false);
    fetchLessons();
  };

  const handleEditLesson = async () => {
    if (!currentLesson) return;
    await fetch(`/api/lessons/${currentLesson.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentLesson),
    });
    setShowEditModal(false);
    fetchLessons();
  };

  return (
    <div className="container mt-4">
      <Button onClick={() => setShowAddModal(true)}>Add Lesson</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson.id}>
              <td>{lesson.id}</td>
              <td>{lesson.title}</td>
              <td>{lesson.content}</td>
              <td>
                <Button onClick={() => { setCurrentLesson(lesson); setShowEditModal(true); }}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Add Lesson Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Lesson</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={3} onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })} />
            </Form.Group>
            <Button onClick={handleAddLesson}>Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Edit Lesson Modal */}
      {currentLesson && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Lesson</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={currentLesson.title} onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Content</Form.Label>
                <Form.Control as="textarea" rows={3} value={currentLesson.content} onChange={(e) => setCurrentLesson({ ...currentLesson, content: e.target.value })} />
              </Form.Group>
              <Button onClick={handleEditLesson}>Update</Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};
